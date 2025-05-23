
import * as iam from "aws-cdk-lib/aws-iam"
import { Function, Runtime, AssetCode, ILayerVersion } from "aws-cdk-lib/aws-lambda"
import { Duration, StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import {AuthorizationType, LambdaIntegration, Resource, CognitoUserPoolsAuthorizer} from 'aws-cdk-lib/aws-apigateway';

//    user_pool: CognitoUserPoolsAuthorizer,

interface LambdaApiStackProps extends StackProps {
    functionName: string,
    functionCode: string,
    account: string,
    methodType: string,
    resource: Resource,
    duration: number,
    layers: ILayerVersion[],
    user_pool?: CognitoUserPoolsAuthorizer,
}

export class LambdaAPILayer extends Construct {
    public lambdaFunction: Function
    public lambdaIntegration: LambdaIntegration

    constructor(scope: Construct, id: string, props: LambdaApiStackProps) {
        super(scope, id)
  
       const ARN =`arn:aws:iam::${props.account}:role/LambdaS3`
       const role1 = iam.Role.fromRoleArn(this, 'Role', ARN, {
        mutable: true,
       });
       role1.grant(new iam.ServicePrincipal("lambda.amazonaws.com"))

        this.lambdaFunction = new Function(this, props.functionName, {
            layers: props.layers,
            functionName: props.functionName,
            handler: "index.handler",
            runtime: Runtime.NODEJS_LATEST,
            code: new AssetCode(props.functionCode),
            memorySize: 512,
            role: role1,
            timeout: Duration.seconds(props.duration),
            environment: {
            },
        })

      this.lambdaIntegration = new LambdaIntegration(
        this.lambdaFunction,
      );

/*
      props.resource.addMethod(props.methodType, this.lambdaIntegration, {
        authorizationType: AuthorizationType.COGNITO,
        authorizer: props.user_pool
      });
      */
    //  props.resource.addMethod(props.methodType, this.lambdaIntegration);
        if (props.user_pool) {
          props.resource.addMethod(props.methodType, this.lambdaIntegration, {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: props.user_pool
          });
      }
      else
        props.resource.addMethod(props.methodType, this.lambdaIntegration);
    
    }
}
