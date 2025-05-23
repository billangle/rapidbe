
import * as iam from "aws-cdk-lib/aws-iam"
import { Function, Runtime, AssetCode  } from "aws-cdk-lib/aws-lambda"
import { Duration, StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';

interface LambdaApiStackProps extends StackProps {
    functionName: string,
    functionCode: string,
    account: string
}

export class LambdaGeneratorCon extends Construct {
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
            functionName: props.functionName,
            handler: "index.handler",
            runtime: Runtime.NODEJS_LATEST,
            code: new AssetCode(props.functionCode),
            memorySize: 512,
            role: role1,
            timeout: Duration.seconds(30),
            environment: {
            },
       
        })



      this.lambdaIntegration = new LambdaIntegration(
        this.lambdaFunction,
      );
      
    }
}
