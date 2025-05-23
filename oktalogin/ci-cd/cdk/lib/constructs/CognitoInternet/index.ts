
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { StringAttribute } from 'aws-cdk-lib/aws-cognito';
import { RemovalPolicy, Duration } from 'aws-cdk-lib';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';


interface Props {
  domainName?: string;
  env?: string;
}


export class CognitoInternet extends Construct {
  public userPool: cognito.UserPool;

  constructor(scope: Construct, id: string, props?: Props) {
      super(scope, id);

      const customAttributeConfig: cognito.CustomAttributeConfig = {
          dataType: 'String',
          mutable: true,
        };

      this.userPool = new cognito.UserPool(this, 'RapidCC-UserPool', {
          selfSignUpEnabled: true,
          signInAliases: {
              username: true
          },
          standardAttributes: {
              email: {
                  mutable: true,
                  required: true
              },
          },
          autoVerify: {
              email: false,
          },
          userPoolName: "RapidCCInternet",
          customAttributes: {
          
              apt:  new StringAttribute({ mutable: true, minLen: 0, maxLen: 2048 }),
              challengeAnswer:  new StringAttribute({ mutable: true, minLen: 0, maxLen: 2048 }),
              challengeQuestion:  new StringAttribute({ mutable: true, minLen: 0, maxLen: 2048 }),
              city:  new StringAttribute({ mutable: true, minLen: 0, maxLen: 2048 }),
              confirmEmail:  new StringAttribute({ mutable: true, minLen: 0, maxLen: 2048 }),
              firstName:  new StringAttribute({ mutable: true, minLen: 0, maxLen: 2048 }),
              lastName:  new StringAttribute({ mutable: true, minLen: 0, maxLen: 2048 }),
              lastSavedDate:  new StringAttribute({ mutable: true, minLen: 0, maxLen: 2048 }),
              middleName:  new StringAttribute({ mutable: true, minLen: 0, maxLen: 2048 }),
              phone:  new StringAttribute({ mutable: true, minLen: 0, maxLen: 2048 }),
              phone2:  new StringAttribute({ mutable: true, minLen: 0, maxLen: 2048 }),
              prefix:  new StringAttribute({ mutable: true, minLen: 0, maxLen: 2048 }),
              state:  new StringAttribute({ mutable: true, minLen: 0, maxLen: 2048 }),
              street1:  new StringAttribute({ mutable: true, minLen: 0, maxLen: 2048 }),
              street2:  new StringAttribute({ mutable: true, minLen: 0, maxLen: 2048 }),
              suffix:  new StringAttribute({ mutable: true, minLen: 0, maxLen: 2048 }),
              zip:  new StringAttribute({ mutable: true, minLen: 0, maxLen: 2048 })
          
          },
          accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
          removalPolicy: RemovalPolicy.DESTROY,
      });


      const adminsGroup = new cognito.CfnUserPoolGroup(this, "Admins", {
          groupName: "Admins",
          description: "Admins Group",
          precedence: 1,
          userPoolId: this.userPool.userPoolId
      });

      const usersGroup = new cognito.CfnUserPoolGroup(this, "Users", {
          groupName: "Users",
          description: "Users Group",
          precedence: 2,
          userPoolId: this.userPool.userPoolId
      });


      const clientWriteAttributes = (new cognito.ClientAttributes())
          .withStandardAttributes({address: true,birthdate:true,email:true,emailVerified:true,familyName:true,gender:true,givenName:true,nickname:true,locale:true,middleName:true,phoneNumber:true,lastUpdateTime:true})
          .withCustomAttributes('apt', 'challegeAnswer','challengeQuestion','city','confimrEmail','firstName','lastName','lastSavedDate','middleName','phone','phone2','prefix','state','street1','street2','suffix','zip');

      const clientReadAttributes = (new cognito.ClientAttributes())
          .withStandardAttributes({address: true,birthdate:true,email:true,emailVerified:true,familyName:true,gender:true,givenName:true,nickname:true,locale:true,middleName:true,phoneNumber:true,lastUpdateTime:true})
          .withCustomAttributes('apt', 'challegeAnswer','challengeQuestion','city','confimrEmail','firstName','lastName','lastSavedDate','middleName','phone','phone2','prefix','state','street1','street2','suffix','zip');


      const appClient = this.userPool.addClient('RapidCC-client', {
          userPoolClientName: 'RapidCC-Client',
          authFlows: {
            userPassword: true,
            userSrp: true
          },
          accessTokenValidity: Duration.days(1),
          idTokenValidity: Duration.days(1),
          refreshTokenValidity: Duration.days(30),
          enableTokenRevocation: true
        });


        /** share User Pool infomration to all systems components */

      const userPoolId = new StringParameter (this, 'RAPIDCCCognitoUserPoolId', {
        parameterName: 'RAPIDCCCognitoUserPoolId',
        stringValue: this.userPool.userPoolId
      });

      const userPoolArn = new StringParameter (this, 'RAPIDCCCognitoUserPoolArn', {
        parameterName: 'RAPIDCCCognitoUserPoolArn',
        stringValue: this.userPool.userPoolArn
      });

      const userPoolClientId = new StringParameter (this, 'RAPIDCCCognitoClientId', {
        parameterName: 'RAPIDCCCognitoClientId',
        stringValue: appClient.userPoolClientId
      });


  }
}