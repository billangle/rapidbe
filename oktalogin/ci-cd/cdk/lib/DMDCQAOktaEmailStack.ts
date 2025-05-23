import * as cdk from 'aws-cdk-lib';
import { StackProps} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ConfigurationData } from '../@types';
import { Route53 } from './constructs/Route53';
import { ACM } from './constructs/ACM';
import { ApiGateway } from './constructs/ApiGateway';
import { DynamoDBAllKeys } from './constructs/DynamoDBAllKeys';
import { RapidS3 } from './constructs/RapidS3';
import { LambdaEvents } from './constructs/LambdaEvents';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { DynamoEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import {
  CognitoUserPoolsAuthorizer
} from 'aws-cdk-lib/aws-apigateway';
import { AssetCode } from "aws-cdk-lib/aws-lambda"
import { CognitoInternet } from './constructs/CognitoInternet';


interface ContractsStackProps extends StackProps {
  configData: ConfigurationData
}

let gatewatename="cdk-oktaqa-ext-api";
let gatewatename2="cdk-oktaqa-ext-api-2";
let getwaydns="oktaqa";

let rootSrcDir="../..";

/** User Management Serverless Backend */
export class DMDCQAOktaEmail extends cdk.Stack {
  public readonly acm: ACM;

  public readonly route53: Route53;


  constructor(scope: Construct, id: string, props: ContractsStackProps) {
    super(scope, id, props);

    let domain =  props.configData.settings.domain

    this.route53 = new Route53(this, gatewatename, {
      domain: domain,   
    });

    const webName =  `${getwaydns}.${domain}`;

    this.acm = new ACM(this, getwaydns, {
      hosted_zone: this.route53.hosted_zone,
       domain: webName,
      region: props.configData.settings.region,

    });





    const apiReportTable = new DynamoDBAllKeys(this,"OktaQAMessages", {
      tableName: "OktaQAMessages",
      partKey: "UUID",
      sortKey: "EmailAddress"
    });


     /** Layer to Support all Lambdas - third-party libraries */
     const proLayer = new lambda.LayerVersion(this, 'okta-qa-dmdc-api-layer', {
      compatibleRuntimes: [
        lambda.Runtime.NODEJS_18_X,
        lambda.Runtime.NODEJS_LATEST,
      ],
      code: new AssetCode(`${rootSrcDir}/layer`),
      layerVersionName: "oktaqa-dmddc-api-layer-ssm",
      description: 'OKTA QA DMDC API Lambda Layer',
    });



   /*
    
    const dynaEventFunc ="RapidCCEvent";
    const dynaFuncName = `${dynaEventFunc}${props.configData.settings.environment}`;
    const dynaEvent  = new LambdaEvents (this, dynaFuncName,{
        functionName:  dynaFuncName,
        functionCode: `${rootSrcDir}/event/${dynaEventFunc}`,
        account: props.configData.settings.account,
        duration: 3,
        layers: []
    } )
      */

     /** RapidS3Data - writing document data to S3 data lake */
     /*
     const dynaEventTrig ="RapidS3Data";
     const dynaFuncTrigName = `${dynaEventTrig}${props.configData.settings.environment}`;
     const dynaEventS3 = new LambdaEvents (this, dynaFuncTrigName,{
         functionName:  dynaFuncTrigName,
         functionCode: `${rootSrcDir}/event/${dynaEventTrig}`,
         account: props.configData.settings.account,
         duration: 3,
         layers: []
     } )

    */


     /** Lambda Triggers by SES Inbound Email message */
     /** TODO - add SES Inbound mail configuration to CDK Stack */
     const SESEventTrig ="SESNewMessage";
     const SESFuncTrigName = `${SESEventTrig}`;
     const SESEventS3 = new LambdaEvents (this, SESFuncTrigName,{
         functionName:  SESFuncTrigName,
         functionCode: `${rootSrcDir}/event/${SESEventTrig}`,
         account: props.configData.settings.account,
         duration: 3,
         layers: [proLayer]
     } )


      /** Lambda Triggers by SES Inbound Email message - triggered from message into S3 bucket */
     const BucketS3EventTrig ="BucketSESMessage";
     const BucketS3FuncTrigName = `${BucketS3EventTrig}`;
     const BucketS3EventS3 = new LambdaEvents (this, BucketS3FuncTrigName,{
         functionName:  BucketS3FuncTrigName,
         functionCode: `${rootSrcDir}/event/${BucketS3EventTrig}`,
         account: props.configData.settings.account,
         duration: 3,
         layers: [proLayer]
     } )


  


    
    /** New API Gateway */
   const apigw = new ApiGateway (this,"OktaQADMDCAPI",{
      acm: this.acm,
      route53: this.route53,
      domain: domain,
      subdomain: `${getwaydns}`,
      env: props.configData.settings.environment,
      account: props.configData.settings.account,
      config: props.configData,
      region: props.configData.settings.region,
      layers: [proLayer],
   })
   

   /** New S3 Bucket for messages */
   const newBucket = new RapidS3(this, "dmdc-okta-qa-messages", {
    env: props.configData.settings.environment,
    base_name: "dmdc-okta-qa-messages"
  });


  /** common API Variables */
  let rapidApi = apigw.rapidAPI;
  let rapidPath = apigw.rapidRequest;




  }
}
