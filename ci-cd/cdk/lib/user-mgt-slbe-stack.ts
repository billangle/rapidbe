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

let gatewatename="cdk-prosams-ext-api";
let gatewatename2="cdk-prosams-ext-api-2";
let getwaydns="rapidum";

let rootSrcDir="../..";

/** User Management Serverless Backend */
export class UserMgtSLBE extends cdk.Stack {
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


    /** Layer to Support all Lambdas - third-party libraries */
    const proLayer = new lambda.LayerVersion(this, 'rapidcc-api-layer', {
      compatibleRuntimes: [
        lambda.Runtime.NODEJS_18_X,
        lambda.Runtime.NODEJS_LATEST,
      ],
      code: new AssetCode(`${rootSrcDir}/layer`),
      layerVersionName: "rapidcc-api-layer-ssm",
      description: 'RAPID CC API Lambda Layer',
    });

    /** Custom code layer */
    const customLayer = new lambda.LayerVersion(this, 'rapidcc-api-custom-layer', {
      compatibleRuntimes: [
        lambda.Runtime.NODEJS_18_X,
        lambda.Runtime.NODEJS_LATEST,
      ],
      code: new AssetCode(`${rootSrcDir}/customlayer`),
      layerVersionName: "rapid-cc-api-custom-layer-ssm",
      description: 'RAPID CC API Lambda Custom Code Layer',
    });



    const ssmReportApiLayerParam = new StringParameter (this, 'RAPIDCCApiLayerSSM', {
      parameterName: 'RAPIDCCApiLayerSSMArn',
      stringValue: proLayer.layerVersionArn
   });


     /** RAPID CC Events is a Stream which can trigger events */
    const apiReportTable = new DynamoDBAllKeys(this,"RAPIDCCEvents", {
      tableName: "RapidCCEvents",
      partKey: "UUID",
      sortKey: "DocType"
    });


     /** RAPID CC Email Events is a Stream which can trigger events */
       const apiEmailEvents = new DynamoDBAllKeys(this,"RAPIDCCEmailEvents", {
        tableName: "RAPIDCCEmailEvents",
        partKey: "UUID",
        sortKey: "Email"
      });
  

    /** RapidCCEvent Lambda  - not used - requires an SQS queue - good example */
    
    const dynaEventFunc ="RapidCCEvent";
    const dynaFuncName = `${dynaEventFunc}${props.configData.settings.environment}`;
    const dynaEvent  = new LambdaEvents (this, dynaFuncName,{
        functionName:  dynaFuncName,
        functionCode: `${rootSrcDir}/event/${dynaEventFunc}`,
        account: props.configData.settings.account,
        duration: 3,
        layers: [proLayer]
    } )
      

     /** RapidS3Data - writing document data to S3 data lake */
     const dynaEventTrig ="RapidS3Data";
     const dynaFuncTrigName = `${dynaEventTrig}${props.configData.settings.environment}`;
     const dynaEventS3 = new LambdaEvents (this, dynaFuncTrigName,{
         functionName:  dynaFuncTrigName,
         functionCode: `${rootSrcDir}/event/${dynaEventTrig}`,
         account: props.configData.settings.account,
         duration: 3,
         layers: [proLayer]
     } )

    /** Triggering the dynaEvent lambda from the DyanmoDB table stream */
    /*
    dynaEvent.lambdaFunction.addEventSource (new DynamoEventSource(
        apiReportTable.table, {startingPosition: lambda.StartingPosition.LATEST}
    ))
        */

     /** Triggering the dynaEvent lambda from the DyanmoDB table stream */
     dynaEventS3.lambdaFunction.addEventSource (new DynamoEventSource(
      apiEmailEvents.table, {startingPosition: lambda.StartingPosition.LATEST}
  ))
    

   /** Cognito User Pool */
   const cogPool = new CognitoInternet (this,'RapidCCCogInternetPool');

   const auth = new CognitoUserPoolsAuthorizer(this,'RapidCC-CDK-Auth-UserAPI', {
     authorizerName: 'RapidCC-CDK-Auth-UserAPI',
     cognitoUserPools: [cogPool.userPool]
   })


   /** TODO create identity pool */


    
    /** New API Gateway */
   const apigw = new ApiGateway (this,"RapidCCUserAPI",{
      acm: this.acm,
      route53: this.route53,
      domain: domain,
      subdomain: `${getwaydns}`,
      env: props.configData.settings.environment,
      account: props.configData.settings.account,
      config: props.configData,
      layers: [proLayer, customLayer],
      userPool: auth,
      region: props.configData.settings.region
   })
   
   const newBucket = new RapidS3(this, `${domain}-userdata-output`, {
    env: props.configData.settings.environment,
    base_name:  `${domain}-userdata-output`
  });


  /** common API Variables */
  let rapidApi = apigw.rapidAPI;
  let rapidPath = apigw.rapidRequest;




  }
}
