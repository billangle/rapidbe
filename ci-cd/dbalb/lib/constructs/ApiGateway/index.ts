import { Construct } from 'constructs';
import {
  EndpointType,
  RestApi,
  SecurityPolicy,
  CognitoUserPoolsAuthorizer,
  AuthorizationType,
} from 'aws-cdk-lib/aws-apigateway';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { ACM } from '../ACM';
import { Route53 } from '../Route53';
import { LambdaGeneratorCon } from '../LambdaGenCon';
import { CfnOutput } from 'aws-cdk-lib';
import { ConfigurationData } from '../../../ecsalb-types';
import { Deployment, Resource, IResource, HttpIntegration} from 'aws-cdk-lib/aws-apigateway';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { UserPool } from "aws-cdk-lib/aws-cognito"



interface Props {
  acm: ACM;
  route53: Route53;
  domain: string;
  subdomain: string;
  env: string;
  account: string;
  config: ConfigurationData;
  albName: string;
}

let stage="prod"
let rootDir=".";





export class ApiGateway extends Construct {
  public rapidCC: Resource;
  public  rapidRequest: Resource;
  public root: IResource;
  public rapidAPI: RestApi;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);


    
    const { acm, route53, domain, subdomain, env, account, config, albName} = props;

    let apiname=`api-external-ecs-gateway-${env}-api`;
    let apiname2="Rapid CC ECS API Gateway";

    const restApi = new RestApi(this, apiname, {
      restApiName: apiname2,
      description: 'Rapid CC ECS API Gateway',
      domainName: {
        certificate: acm.certificate,
        domainName: `${subdomain}.${domain}`,
        endpointType: EndpointType.REGIONAL,
        securityPolicy: SecurityPolicy.TLS_1_2,
      },
      deployOptions: {
        stageName: stage,
        variables: {
            "proenvironment": props.env,
            "prodomain": props.domain,
        }
      },
    });

    this.rapidAPI = restApi;

    /** MUST create an end-point to create an API Gateway */
    const getHealthCheck = new LambdaGeneratorCon (this, 'get-ecs-health-check',{
        functionName: "getECSGatewayHealthCheck",
        functionCode: `${rootDir}/src/getHealthCheck`,
        account: account
      } )

    const healthcheck = restApi.root.addResource('healthcheck');
   
   healthcheck.addMethod('GET', getHealthCheck.lambdaIntegration);
   healthcheck.addCorsPreflight({
     allowOrigins: ['*'],
     allowHeaders: ['*'],
     allowMethods: ['*'],
     statusCode: 204,
   });

  
   /** Cognito User Pool */

   const cogARN = StringParameter.fromStringParameterAttributes(this,  'RAPIDCCCognitoUserPoolArn', {
      parameterName: 'RAPIDCCCognitoUserPoolArn'
   });
   const userPool = UserPool.fromUserPoolArn(this, 'RAPIDCC-POOL', cogARN.stringValue);

   const auth = new CognitoUserPoolsAuthorizer(this,'RAPIDCC-CDK-Auth-ECSAPI', {
     authorizerName: 'RAPIDCC-CDK-Auth-ECSAPI',
     cognitoUserPools: [userPool]
   })

    const apiName = `${subdomain}.${domain}`;

 /** add methods to integrate with ECS ALB */

     const albUrlBase = `https://${albName}/properties/integration/site`;
     console.log ("ALB URL: ", albUrlBase);

     const siteIntegration = restApi.root.addResource('site').addResource('{id}');
    siteIntegration.addMethod('ANY', 
        new HttpIntegration(`${albUrlBase}/{id}`, {
                httpMethod: 'ANY',
                proxy: true,

                options: {
                    requestParameters: {
                    'integration.request.path.id': 'method.request.path.id',
                    'integration.request.header.Host': `'${apiName}'`, 
                    },
                },
                }), {
                requestParameters: {
                    'method.request.path.id': true,
                },
                methodResponses: [{ statusCode: '200' }],
                authorizationType: AuthorizationType.COGNITO,
                authorizer: auth,
        });
    
    siteIntegration.addCorsPreflight({  allowOrigins: ['*'], allowHeaders: ['*'], allowMethods: ['*'], statusCode: 204, });


    const siteIntegrationDelete = siteIntegration.addResource('index').addResource('{index}');
    siteIntegrationDelete.addMethod('DELETE', new HttpIntegration(`${albUrlBase}/{id}/index/{index}`, {
        httpMethod: 'DELETE',
        proxy: true,
        options: {
            requestParameters: {
              'integration.request.path.id': 'method.request.path.id',
              'integration.request.path.index': 'method.request.path.index',
              'integration.request.header.Host': `'${apiName}'`, 
            },
          },
        }), {
          requestParameters: {
            'method.request.path.id': true,
            'method.request.path.index': true,
          },
          methodResponses: [{ statusCode: '200' }],
          authorizationType: AuthorizationType.COGNITO,
          authorizer: auth,
        });
    siteIntegrationDelete.addCorsPreflight({  allowOrigins: ['*'], allowHeaders: ['*'], allowMethods: ['*'], statusCode: 204, });


   /** Popualting SSM variables for other stacks or processes */
   const webName = `${subdomain}.${domain}`;

    new ARecord(this, 'BackendECSAliasRecord', {
      zone: route53.hosted_zone,
      target: RecordTarget.fromAlias(new targets.ApiGateway(restApi)),
      recordName: `${subdomain}.${domain}`,
    });

    const gwArn = this.rapidAPI.arnForExecuteApi();
    const ssmApiGatewayECSExeArn = new StringParameter (this, 'RAPIDCCApiECSGatewayExeARN', {
      parameterName: 'RAPIDCCApiECSGatewayExeARN',
      stringValue: gwArn
    });

    const apiGwSimpleArn = `arn:aws:apigateway:${props.config.settings.region}::/restapis/${this.rapidAPI.restApiId}`;

    const ssmApiGatewayECSArn = new StringParameter (this, 'RAPIDCCApiECSGatewayARN', {
      parameterName: 'RAPIDCCApiECSGatewayARN',
      stringValue: apiGwSimpleArn
    });

    const ssmApiGatewayECSDnsName = new StringParameter (this, 'RAPIDCCApiECSGatewayDNSName', {
      parameterName: 'RAPIDCCApiECSGatewayDNSName',
      stringValue: webName
    });

    const ssmApiGatewayECSId = new StringParameter (this, 'RAPIDCCApiECSGatewayID', {
      parameterName: 'RAPIDCCApiECSGatewayID',
      stringValue: this.rapidAPI.restApiId
    });

    const ssmApiGatewayECSResourceId = new StringParameter (this, 'RAPIDCCApiECSGatewayRootResourceId', {
      parameterName: 'RAPIDCCApiECSGatewayRootResourceId',
      stringValue: this.rapidAPI.root.resourceId
    });


  }
}
