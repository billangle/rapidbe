
import * as iam from "aws-cdk-lib/aws-iam"
import { Function, Runtime, AssetCode, ILayerVersion } from "aws-cdk-lib/aws-lambda"
import { Duration, StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import {AuthorizationType, LambdaIntegration, Resource, CognitoUserPoolsAuthorizer} from 'aws-cdk-lib/aws-apigateway';
import { IVpc, SecurityGroup, SubnetType } from "aws-cdk-lib/aws-ec2";

//    user_pool: CognitoUserPoolsAuthorizer,

interface LambdaApiStackProps extends StackProps {
    functionName: string,
    functionCode: string,
    account: string,
    duration: number,
    layers: ILayerVersion[],
    secretArn: string,
    dbhost: string,
    vpc: IVpc,
    securityGroups: SecurityGroup[]
}

export class LambdaLayer extends Construct {
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
                DB_USER: 'postgres',
                DB_SECRET_ARN: props.secretArn, 
                DB_HOST: props.dbhost,
            },
            vpc: props.vpc,
            securityGroups: [props.securityGroups[0]],
            vpcSubnets: {subnetType: SubnetType.PRIVATE_WITH_NAT}
            
            
        })

    }
}
