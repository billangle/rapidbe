import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StackProps} from 'aws-cdk-lib';
import { ConfigurationData } from '../ecsalb-types';
import { ECS } from './constructs/ECS2';
import { Route53 } from './constructs/Route53';
import { ACM } from './constructs/ACM';


interface ContractsStackProps extends StackProps {
  configData: ConfigurationData
}

let gatewatename="cdk-rapidcc-lb";
let getwaydns="umdocs";

export class EcsalbStack extends cdk.Stack {

  public readonly acm: ACM;

  public readonly route53: Route53;

  public readonly ecs: ECS;

    constructor(scope: Construct, id: string, props: ContractsStackProps) {
      super(scope, id, props);

      let domain =  props.configData.settings.domain

      this.route53 = new Route53(this, gatewatename, {
        domain: domain,   
      });
  
      const webName =  `${getwaydns}.${domain}`;

      console.log("ALB Address: ", webName);

      this.acm = new ACM(this, getwaydns, {
        hosted_zone: this.route53.hosted_zone,
         domain: webName,
        region: props.configData.settings.region,
  
      });
  
 
      this.ecs = new ECS(this, 'ECS', {
       env: props.configData.settings.environment,
       acm: this.acm,
       route53: this.route53,
       domain: domain,
       subdomain: getwaydns,
      });
    }
}
