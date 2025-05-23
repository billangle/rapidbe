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
  layers: ILayerVersion[];
  userPool: CognitoUserPoolsAuthorizer;
  region: string;
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

    let apiname=`api-external-gateway-${env}-api`;
    let apiname2="Rapid CC User API";

    const restApi = new RestApi(this, apiname, {
      restApiName: apiname2,
      description: 'Rapid CC User API',
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
    const getHealthCheck = new LambdaGeneratorCon (this, 'get-reports-health-check',{
        functionName: "getReportHealthCheck",
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

/**
 * Setup for Rapid endpoints
 */


 /**
  *   Login
  */
    this.root = restApi.root;
    const auth = restApi.root.addResource("auth");
    const internal = auth.addResource("internal");
    const internalLogin = internal.addResource("login");
    const internalUser =  internalLogin.addResource("{username}");
    const internalPass =  internalUser.addResource("{password}");
    const getInternalLoginFunc = "getInternalLogin";
    const getInternalLogin  = new LambdaAPILayer (this, getInternalLoginFunc,{
        functionName:  getInternalLoginFunc,
        functionCode: `${rootSrcDir}/rest/${getInternalLoginFunc}`,
        account: account,
        methodType: "GET",
        resource: internalPass,
        duration: 3,
        layers: props.layers
    } )
    
    internalPass.addCorsPreflight({
        allowOrigins: ['*'],
        allowHeaders: ['*'],
        allowMethods: ['*'],
        statusCode: 204,
    });

    
   /** add new user resources */
    this.rapidCC = restApi.root.addResource("rapid");
    const request= this.rapidCC.addResource ("request");
    const createNewUser = request.addResource("newuser");
    this.rapidRequest = request;


    /** add new user */

    const createUserFunc = "createUser";
    const createUser  = new LambdaAPILayer (this,createUserFunc,{
        functionName:  createUserFunc,
        functionCode: `${rootSrcDir}/rest/${createUserFunc}`,
        account: account,
        methodType: "PUT",
        resource: createNewUser,
        duration: 3,
        layers: props.layers
    } )
    
    createNewUser.addCorsPreflight({
        allowOrigins: ['*'],
        allowHeaders: ['*'],
        allowMethods: ['*'],
        statusCode: 204,
    });

    /** list users resources */
  
    const list = this.rapidCC.addResource ("list");
    const listUsers  = list.addResource("users");

    /** list users - need to have something that needs a token */

    const listUserFunc = "listUsers";
    const listUser  = new LambdaAPILayer (this,listUserFunc,{
        functionName:  listUserFunc,
        functionCode: `${rootSrcDir}/rest/${listUserFunc}`,
        account: account,
        methodType: "GET",
        resource: listUsers,
        duration: 5,
        layers: props.layers,
        user_pool: props.userPool
    } )

    listUsers.addCorsPreflight({
        allowOrigins: ['*'],
        allowHeaders: ['*'],
        allowMethods: ['*'],
        statusCode: 204,
    });


   /** delete user resources  */
    const del = this.rapidCC.addResource ("delete");
    const delUser  = del.addResource("user");
    const delUserName = delUser.addResource("{username}");

    /** delete a user- allows testing of full user API*/

    const deleteUserFunc = "deleteUser";
    const deleteUser  = new LambdaAPILayer (this,deleteUserFunc,{
        functionName:  deleteUserFunc,
        functionCode: `${rootSrcDir}/rest/${deleteUserFunc}`,
        account: account,
        methodType: "DELETE",
        resource: delUserName,
        duration: 5,
        layers: props.layers,
        user_pool: props.userPool
    } )

    delUserName.addCorsPreflight({
        allowOrigins: ['*'],
        allowHeaders: ['*'],
        allowMethods: ['*'],
        statusCode: 204,
    });

      /** change password resources */
  
      const change = this.rapidCC.addResource ("change");
      const chgPass  = change.addResource("password");
      const chgUser = chgPass.addResource("{username}");
  
      /** change password - requires a token */
  
      const chgPassFunc = "changePassword";
      const chgPassUser  = new LambdaAPILayer (this,chgPassFunc,{
          functionName:  chgPassFunc,
          functionCode: `${rootSrcDir}/rest/${chgPassFunc}`,
          account: account,
          methodType: "PUT",
          resource: chgUser,
          duration: 5,
          layers: props.layers,
          user_pool: props.userPool
      } )
  
      chgUser.addCorsPreflight({
          allowOrigins: ['*'],
          allowHeaders: ['*'],
          allowMethods: ['*'],
          statusCode: 204,
      });
  

        /** service email */
  
        const send = this.rapidCC.addResource ("send");
        const msg  = send.addResource("message");
     
    
        /** service email */
    
        const serviceEmailFunc = "ServiceEmail";
        const serviceEmail  = new LambdaAPILayer (this,serviceEmailFunc,{
            functionName:  serviceEmailFunc,
            functionCode: `${rootSrcDir}/rest/${serviceEmailFunc}`,
            account: account,
            methodType: "PUT",
            resource: msg,
            duration: 3,
            layers: props.layers,
            user_pool: props.userPool
        } )
    
        msg.addCorsPreflight({
            allowOrigins: ['*'],
            allowHeaders: ['*'],
            allowMethods: ['*'],
            statusCode: 204,
        });
    

          /** report data */
  
          const report = this.rapidCC.addResource ("report");
          const data  = report.addResource("data");
       
      
          /** report data */
      
          const reportDataFunc = "ServiceRptData";
          const reportData  = new LambdaAPILayer (this,reportDataFunc,{
              functionName:  reportDataFunc,
              functionCode: `${rootSrcDir}/rest/${reportDataFunc}`,
              account: account,
              methodType: "GET",
              resource: data,
              duration: 3,
              layers: props.layers,
              user_pool: props.userPool
          } )
      
          data.addCorsPreflight({
              allowOrigins: ['*'],
              allowHeaders: ['*'],
              allowMethods: ['*'],
              statusCode: 204,
          });


          /** report data - one item */
        
          const item = data.addResource("{citystate}");
      
         /** report data - one item */
      
          const reportDataItemFunc = "ReportDataItem";
          const reportDataItem  = new LambdaAPILayer (this,reportDataItemFunc,{
              functionName:  reportDataItemFunc,
              functionCode: `${rootSrcDir}/rest/${reportDataItemFunc}`,
              account: account,
              methodType: "GET",
              resource: item,
              duration: 3,
              layers: props.layers,
              user_pool: props.userPool
          } )
      
          item.addCorsPreflight({
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
    new CfnOutput(this,"RapidCCAPIGatewayId", {
       exportName: "RapidCC-API-Gateway-Id",
       value: restApi.restApiId
    })

    new CfnOutput(this,"RapidCCAPIGatewayRootId", {
        exportName: "RapidCC-API-Gateway-Root-Id",
        value: restApi.root.resourceId
     })
  }
}
