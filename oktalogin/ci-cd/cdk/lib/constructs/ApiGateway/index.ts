import { Construct } from 'constructs';
import {
  EndpointType,
  RestApi,
  SecurityPolicy,
  CognitoUserPoolsAuthorizer,
} from 'aws-cdk-lib/aws-apigateway';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { ACM } from '../ACM';
import { Route53 } from '../Route53';
import { LambdaGeneratorCon } from '../LambdaGenCon';
import { CfnOutput } from 'aws-cdk-lib';
import { ConfigurationData } from '../../../@types';
import { LambdaAPILayer } from '../LambdaAPILayer';
import { Deployment, Resource, IResource} from 'aws-cdk-lib/aws-apigateway';
import {ILayerVersion } from "aws-cdk-lib/aws-lambda"




interface Props {
  acm: ACM;
  route53: Route53;
  domain: string;
  subdomain: string;
  env: string;
  account: string;
  config: ConfigurationData;
  region: string;
  layers: ILayerVersion[];
}

let stage="prod"
let rootDir=".";

let rootSrcDir="../..";


export class ApiGateway extends Construct {
  public rapidCC: Resource;
  public  rapidRequest: Resource;
  public root: IResource;
  public rapidAPI: RestApi;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);


    const { acm, route53, domain, subdomain, env, account, config} = props;

    let apiname=`api-oktaqa-gateway-${env}-api`;
    let apiname2="DMDC OKTA QA API";

    const restApi = new RestApi(this, apiname, {
      restApiName: apiname2,
      description: 'DMDC OKTA QA API',
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
            "proregion": props.region,
            "prodomain": props.domain,
        }
      },
    });

    this.rapidAPI = restApi;

    /** MUST create an end-point to create an API Gateway */
    const getHealthCheck = new LambdaGeneratorCon (this, 'get-oktaqa-health-check',{
        functionName: "getOktaQAHealthCheck",
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


    new ARecord(this, 'BackendAliasRecord', {
      zone: route53.hosted_zone,
      target: RecordTarget.fromAlias(new targets.ApiGateway(restApi)),
      recordName: `${subdomain}.${domain}`,
    });



 
    this.root = restApi.root;
    const oktaqa = restApi.root.addResource('oktaqa');
    const checkEmail = oktaqa.addResource('checkemail');
    const email = checkEmail.addResource('{email}');

    const getOktaQAFunc = "getOktaAuthCode";
    const getOktaQA  = new LambdaAPILayer (this, getOktaQAFunc,{
        functionName:  getOktaQAFunc,
        functionCode: `${rootSrcDir}/rest/${getOktaQAFunc}`,
        account: account,
        methodType: "GET",
        resource: email,
        duration: 3,
        layers: props.layers
    } )

    email.addCorsPreflight({
      allowOrigins: ['*'],
      allowHeaders: ['*'],
      allowMethods: ['*'],
      statusCode: 204,
   });



   const onlyCode= oktaqa.addResource('onlycode');
   const emailCode = onlyCode.addResource('{email}');

   const getOnlyCodeFunc = "getOnlyAuthCode";
   const getOnlyCode  = new LambdaAPILayer (this, getOnlyCodeFunc,{
       functionName:  getOnlyCodeFunc,
       functionCode: `${rootSrcDir}/rest/${getOnlyCodeFunc}`,
       account: account,
       methodType: "GET",
       resource: emailCode,
       duration: 3,
       layers: props.layers
   } )

   emailCode.addCorsPreflight({
     allowOrigins: ['*'],
     allowHeaders: ['*'],
     allowMethods: ['*'],
     statusCode: 204,
  });

 
    /** deploy changes */
    const deploy = new Deployment(this,"ApiGatewayStageDeploy",{
        api: restApi
    })



    /** make items available to other stacks */
    new CfnOutput(this,"OktaQAGatewayId", {
       exportName: "OktaQA-API-Gateway-Id",
       value: restApi.restApiId
    })

    new CfnOutput(this,"OktaQAGatewayRootId", {
        exportName: "OktaQA-API-Gateway-Root-Id",
        value: restApi.root.resourceId
     })
  }
}
