import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
import { Construct } from 'constructs';
import { resolve } from 'path';
import { ACM } from '../ACM';
import { Route53 } from '../Route53';
import { ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';


interface Props {
    env: string;
    acm: ACM;
    route53: Route53;
    domain: string;
    subdomain: string;
  }

export class ECS extends Construct {


    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id);

        const { acm, route53, domain, subdomain, env} = props;

          const vpc = new ec2.Vpc(this, "RapidCCVPC", {
              maxAzs: 2 // Default is all AZs in region
            });
        
            const cluster = new ecs.Cluster(this, "RapidCCCluster", {
              vpc: vpc
            });
        
            // Create a load-balanced Fargate service and make it public
            const fargate= new ecs_patterns.ApplicationLoadBalancedFargateService(this, "RapidCCFargateService", {
              cluster: cluster, // Required
              cpu: 512, // Default is 256
              desiredCount: 1, // Default is 1
              taskImageOptions: { image: ecs.ContainerImage.fromAsset(resolve(__dirname, '..', '..', '..', 'container'))},
              memoryLimitMiB: 2048, // Default is 512
              publicLoadBalancer: true // Default is true
            });

            const container = fargate.taskDefinition.defaultContainer;

            container?.addEnvironment ("APISERVER", `rapidum.${domain}`);

            fargate.loadBalancer.addListener('HttpsListener', {
              port: 443,
              certificates: [acm.certificate], // Use the ACM SSL certificate here
              defaultTargetGroups: [fargate.targetGroup],
            });


            new ARecord(this, 'ALBAliasRecord', {
              zone: route53.hosted_zone,
              target: RecordTarget.fromAlias(new targets.LoadBalancerTarget(fargate.loadBalancer)),
              recordName: `${subdomain}.${domain}`,
            });

    }

}