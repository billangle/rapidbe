import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
import { Construct } from 'constructs';
import { resolve } from 'path';
import { ACM } from '../ACM';
import { Route53 } from '../Route53';
import { ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as customResources from 'aws-cdk-lib/custom-resources';
import { LambdaLayer } from '../LambdaLayer';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { AlbListenerTarget } from "aws-cdk-lib/aws-elasticloadbalancingv2-targets";
import { Tags } from 'aws-cdk-lib';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';

interface Props {
    env: string;
    acm: ACM;
    route53: Route53;
    domain: string;
    subdomain: string;
    account: string;
    dbpass: string;
    containerType: string;
    gwName: string;
  }

  let rootSrcDir="src";

export class ECS extends Construct {


    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id);

        const { acm, route53, domain, subdomain, env, account, dbpass, containerType, gwName} = props;


        // builing both conatiners swagger which goes to /container and javadb which goes to /containerdb
        // string could be container or containerdb

        
        console.log ("Container type: " + containerType);

          const vpc = new ec2.Vpc(this, "RapidCCDbAlbVPC", {
              maxAzs: 2,// Default is all AZs in region
              natGateways: 1, // Allow private subnets to access the internet (for outbound requests)
              subnetConfiguration: [
                {
                  name: 'PrivateSubnet',
                  subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS, // Subnets with NAT Gateway for outbound internet access
                },
                {
                  name: 'PublicSubnet',
                  subnetType: ec2.SubnetType.PUBLIC, // Public subnet for internet-facing services
                },
              ],
            });
        
            const cluster = new ecs.Cluster(this, "RapidCCDbAlbCluster", {
              vpc: vpc
            });
            

            const dbSecret = new secretsmanager.Secret(this, 'RapidCCDbSecretPOST', {
              secretName: 'postgresql-credentials-rds',
              generateSecretString: {
                secretStringTemplate: JSON.stringify({ username: 'postgres' }),
                generateStringKey: 'password',
                excludePunctuation: true,
              },
            });


            const pgLayer = new lambda.LayerVersion(this, 'PgLayer', {
              code: lambda.Code.fromAsset('dblayers'), // Path to the directory containing the pg module
              compatibleRuntimes: [lambda.Runtime.NODEJS_LATEST], // Specify compatible Node.js runtime
              description: 'PostgreSQL client library',
            });
        

            const parameterGroup = new rds.ParameterGroup(this, 'PostgresParameterGroup', {
              engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_16_3 }),
              parameters: {
                'password_encryption': 'md5', // Set password encryption to MD5
              },
            });

            const securityGroups = new ec2.SecurityGroup(this, 'DbSecurityGroup', { vpc });
        

            const dbInstance = new rds.DatabaseInstance(this, 'PostgresInstance', {
              engine:rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_16_3 }),
              instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.SMALL), // db.t3.micro instead of db.t2.micro
              vpc,
              credentials: rds.Credentials.fromSecret(dbSecret),
              multiAz: false,
              allocatedStorage: 20,
              maxAllocatedStorage: 100,
              removalPolicy: cdk.RemovalPolicy.DESTROY, // Only for dev/test environments
              securityGroups: [securityGroups],
              parameterGroup: parameterGroup,
            });
            

            const lambdaSecurityGroup = new ec2.SecurityGroup(this, 'LambdaSecurityGroup', {
              vpc,
              allowAllOutbound: true, // Allow outbound traffic
            });



            const proxy = new rds.DatabaseProxy(this, 'Proxy', {
              proxyTarget: rds.ProxyTarget.fromInstance(dbInstance),
              secrets: [dbSecret],
              vpc,
              securityGroups: [lambdaSecurityGroup],
            });



            const role = new iam.Role(this, 'DBProxyRole', { assumedBy: new iam.AccountPrincipal(account) });
            proxy.grantConnect(role, 'admin'); // Grant the role connection access to the DB Proxy for database user 'admin'.




            const createSchemaLambdaFunc = "CreateSchemaLambda";
            const createSchemaLambda  = new LambdaLayer (this, createSchemaLambdaFunc ,{
                functionName:  createSchemaLambdaFunc,
                functionCode: `${rootSrcDir}/${createSchemaLambdaFunc}`,
                account: props.account,
                duration: 30,
                layers: [pgLayer],
                secretArn: dbSecret.secretArn,
                dbhost: dbInstance.dbInstanceEndpointAddress,
                vpc: vpc,
                securityGroups: [lambdaSecurityGroup],
            } )

                // Grant the Lambda function permission to connect to the RDS proxy
            proxy.grantConnect(createSchemaLambda.lambdaFunction);
            dbSecret.grantRead(createSchemaLambda.lambdaFunction);

            const dbSecurityGroup = dbInstance.connections.securityGroups[0];
            dbSecurityGroup.addIngressRule(
              lambdaSecurityGroup, // Allow traffic from the Lambda security group
              ec2.Port.tcp(5432), // Allow traffic on port 5432 (PostgreSQL)
              'Allow Lambda to connect to PostgreSQL'
            );

            // Custom resource to invoke the Lambda function after RDS instance is available
            
            
            const createSchemaProvider = new customResources.Provider(this, 'CreateSchemaProvider', {
              onEventHandler: createSchemaLambda.lambdaFunction,
            });
            

            // Create a custom resource that triggers the Lambda function to create the schema

          
            new cdk.CustomResource(this, 'CreateSchemaResource', {
              serviceToken: createSchemaProvider.serviceToken,
            });


            
            // Create a load-balanced Fargate service and make it public
            const fargate= new ecs_patterns.ApplicationLoadBalancedFargateService(this, "RapidCCDbAlbFargateService", {
              cluster: cluster, // Required
              cpu: 512, // Default is 256
              desiredCount: 1, // Default is 1
              taskImageOptions: { image: ecs.ContainerImage.fromAsset(resolve(__dirname, '..', '..', '..', containerType))},
              memoryLimitMiB: 2048, // Default is 512
              publicLoadBalancer: true, // Default is true
              healthCheck: {
                command: ['CMD-SHELL', 'curl -f http://localhost/ || exit 1'],
                interval: cdk.Duration.seconds(30),
                timeout: cdk.Duration.seconds(5),
                retries: 3,
                startPeriod: cdk.Duration.seconds(60),
              },
              deploymentController: {
                type: ecs.DeploymentControllerType.ECS,
              },
              circuitBreaker: { // Optional, enables rollback on failure
                rollback: true,
              },
              listenerPort: 80, // Add this line to set the listener port to 80
           //   redirectHTTP: true, // Add this line to redirect HTTP to HTTPS
            });

            fargate.listener.addAction('DefaultFixedResponse', {
              action: elbv2.ListenerAction.fixedResponse(200, {
                contentType: 'text/plain',
                messageBody: 'OK',
              }),
            });
            
            const container = fargate.taskDefinition.defaultContainer;
         
          
          
            dbSecret.grantRead(fargate.taskDefinition.taskRole);
            dbInstance.grantConnect(fargate.taskDefinition.taskRole);
            //   dbInstance.grantConnect(fargate.taskDefinition.taskRole, 'postgres');

            dbInstance.connections.allowDefaultPortFrom(fargate.service, 'Ingress from Fargate to RDS');
       
        
            const myData = dbSecret.secretValueFromJson('password').unsafeUnwrap();
            
            container?.addEnvironment ("APISERVER", `rapidum.${domain}`);
            container?.addEnvironment ("DB_HOST",  dbInstance.dbInstanceEndpointAddress);
            container?.addEnvironment ("DB_PORT",  dbInstance.dbInstanceEndpointPort);
            container?.addEnvironment ("DB_USER",  'postgres');
            container?.addEnvironment ("DB_SECRET_ARN", dbSecret.secretArn );
            container?.addEnvironment ("DB_NAME",  'thrive');
            container?.addEnvironment ("DB_PASS",  myData.toString());
            container?.addEnvironment ("RDS_PASS",  myData.toString());

            
/*
            fargate.loadBalancer.addListener('HttpsListener', {
              port: 443,
              certificates: [acm.certificate], // Use the ACM SSL certificate here
              defaultTargetGroups: [fargate.targetGroup],
  
            });
*/


 
            const httpsListener = fargate.loadBalancer.addListener('HttpsListener', {
              port: 443,
              certificates: [acm.certificate], // Use the ACM SSL certificate here
              defaultAction: elbv2.ListenerAction.fixedResponse(200, {}),
            });

           
            /*
            httpsListener.addTargets('FargateTarget', {
              healthCheck: {  
                  interval: cdk.Duration.seconds(60),
                  path: "/",
                  timeout: cdk.Duration.seconds(5),
              }
            });
            */

           const r = new elbv2.ApplicationListenerRule(this, 'ListenerApiGwRule', {
              listener: httpsListener,
              priority: 5,
              action: elbv2.ListenerAction.forward([fargate.targetGroup]),
              conditions: [
                elbv2.ListenerCondition.hostHeaders([gwName]),
              ],
            }); 

            Tags.of(r).add('Name', 'ApiGwRule');
         


            const r2 = new elbv2.ApplicationListenerRule(this, 'ListenerApiGwRuleSwagger1', {
              listener: httpsListener,
              priority: 1,
              action: elbv2.ListenerAction.forward([fargate.targetGroup]),
              conditions: [
                elbv2.ListenerCondition.pathPatterns(["/v3/api-docs"]),
              ],
            }); 

            Tags.of(r2).add('Name', 'SwaggerDocsRule');

            const r3 = new elbv2.ApplicationListenerRule(this, 'ListenerApiGwRuleSwagger2', {
              listener: httpsListener,
              priority: 2,
              action: elbv2.ListenerAction.forward([fargate.targetGroup]),
              conditions: [
                elbv2.ListenerCondition.pathPatterns(["/swagger-ui/*"]),
              ],
            }); 

            Tags.of(r3).add('Name', 'SwaggerDocsBaseRule');
         

            new ARecord(this, 'ALBDbAliasRecord', {
              zone: route53.hosted_zone,
              target: RecordTarget.fromAlias(new targets.LoadBalancerTarget(fargate.loadBalancer)),
              recordName: `${subdomain}.${domain}`,
            });

            
            new cdk.CfnOutput(this, 'RdsEndpoint', {
              value: dbInstance.dbInstanceEndpointAddress,
            });

/** Variables to shared with other stacks */

            const ssmEcsClusterARN = new StringParameter(this, 'SSMEcsClusterARN', {
              parameterName: 'ECSClusterARN',
              stringValue: cluster.clusterArn,
            });

            const ssmClusterName = new StringParameter(this, 'SSMEcsClusterName', {
              parameterName: 'ECSClusterName',
              stringValue: cluster.clusterName,
            });

            const ssmDbSecretARN = new StringParameter(this, 'SSMPostgresSecretARN', {
              parameterName: 'ECSPostgresSecretARN',
              stringValue: dbSecret.secretArn,
            }); 

            const ssmSecurityGroup = new StringParameter(this, 'SSMSecurityGroup', {
              parameterName: 'ECSPostgresSecurityGroup',
              stringValue: securityGroups.securityGroupId,
            });

            const ssmDBInstanceARN = new StringParameter(this, 'SSMPostgresInstanceARN', {
              parameterName: 'ECSPostgresInstanceARN',
              stringValue: dbInstance.instanceArn,
            });

            const ssmDBInstanceId = new StringParameter(this, 'SSMPostgresInstanceId', {
              parameterName: 'ECSPostgresInstanceId',
              stringValue: dbInstance.instanceIdentifier,
            });


            const ssmDBInstanceResId = new StringParameter(this, 'SSMPostgresResourceId', {
              parameterName: 'ECSPostgresResourceId',
              stringValue: dbInstance.instanceResourceId || '',
            });

            const ssmDBInstanceEndpoint = new StringParameter(this, 'SSMPostgresInstanceEndpoint', {
              parameterName: 'ECSPostgresInstanceEndpoint',
              stringValue: dbInstance.dbInstanceEndpointAddress,
            });

            const ssmDBInstancePort = new StringParameter(this, 'SSMPostgresInstancePort', {
              parameterName: 'ECSPostgresInstancePort',
              stringValue: dbInstance.dbInstanceEndpointPort,
            });

            const ssmLambdaSecurityGroup = new StringParameter(this, 'SSMLambdaSecurityGroup', {
              parameterName: 'ECSLambdaSecurityGroup',
              stringValue: lambdaSecurityGroup.securityGroupId,
            });

            const ssmDbProxyARN = new StringParameter(this, 'SSMPostgresProxyARN', {
              parameterName: 'ECSPostgresProxyARN',
              stringValue: proxy.dbProxyArn,
            });


            const ssmPgLayerversion = new StringParameter(this, 'SSMPgLayerversion', {
              parameterName: 'PgLayerVersion',
              stringValue: pgLayer.layerVersionArn,
            });

            const ssmVPcId = new StringParameter(this, 'SSMVPCId', {
              parameterName: 'ECSVPCId',
              stringValue: vpc.vpcId,
            }); 
    }

}