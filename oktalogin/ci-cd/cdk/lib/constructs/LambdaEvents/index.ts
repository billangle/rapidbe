
import * as iam from "aws-cdk-lib/aws-iam"
import { Function, Runtime, AssetCode, ILayerVersion  } from "aws-cdk-lib/aws-lambda"
import { Duration, StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"

interface LambdaApiStackProps extends StackProps {
    functionName: string,
    functionCode: string,
    account: string
    duration: number;
    layers: ILayerVersion[]
}

export class LambdaEvents extends Construct {
    public lambdaFunction: Function


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
            memorySize: 2048,
            role: role1,
            timeout: Duration.seconds(props.duration),
            environment: {
                "AWS_NODEJS_CONNECTION_REUSE_ENABLED": "true"
            },
       
        })



    }
}
