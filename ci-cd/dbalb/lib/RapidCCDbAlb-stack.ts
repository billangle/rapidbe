import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StackProps} from 'aws-cdk-lib';
import { ConfigurationData } from '../ecsalb-types';
import { ECS } from './constructs/ECS2';
import { Route53 } from './constructs/Route53';
import { ACM } from './constructs/ACM';
import { ApiGateway } from './constructs/ApiGateway';


interface ContractsStackProps extends StackProps {
  configData: ConfigurationData;
  dbpass: any;
  containerType: any;
}

let gatewatename="cdk-rapidcc-javadb-lb";
let getwaydns="javadb";   // used for ALB
let apiGatewayDNS="javaapi";  // used for API Gateway

export class RapidCCDbAlbStack extends cdk.Stack {

  public readonly acm: ACM;
  public readonly gwACM: ACM;

  public readonly route53: Route53;

  public readonly ecs: ECS;

    constructor(scope: Construct, id: string, props: ContractsStackProps ) {
      super(scope, id, props);

      let domain =  props.configData.settings.domain

      this.route53 = new Route53(this, gatewatename, {
        domain: domain,   
      });
  
      const webName =  `${getwaydns}.${domain}`;
      const apiGW = `${apiGatewayDNS}.${domain}`;

      console.log("ALB Address: ", webName);
      console.log("API Gateway Address: ", apiGW);


      this.acm = new ACM(this, getwaydns, {
        hosted_zone: this.route53.hosted_zone,
         domain: webName,
        region: props.configData.settings.region,
  
      });

      this.gwACM = new ACM(this, apiGatewayDNS, {
        hosted_zone: this.route53.hosted_zone,
         domain: apiGW,
        region: props.configData.settings.region,
  
      });
     // the string could be containerdb or container -
      const containerType = "containerdb"; // always build the db container - 
 
      /** Creates ECS Cluster, Postgres RDS, Fargate service, ALB - Lambda to create the database */
      this.ecs = new ECS(this, 'ECS', {
       env: props.configData.settings.environment,
       acm: this.acm,
       route53: this.route53,
       domain: domain,
       subdomain: getwaydns,
       account: props.configData.settings.account,
       dbpass: props.dbpass,
       containerType: containerType,
       gwName: apiGW
      });

     console.log("ALB: ", webName);

      /** New API Gateway */
      const apigw = new ApiGateway (this,"RapidCCECSatewayAPI",{
        acm: this.gwACM,
        route53: this.route53,
        domain: domain,
        subdomain: `${apiGatewayDNS}`,
        env: props.configData.settings.environment,
        account: props.configData.settings.account,
        config: props.configData,
        albName: webName
    })

    }
}
