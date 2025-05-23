
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  ExecuteStatementCommand,
  DynamoDBDocumentClient,
  UpdateCommand
} from "@aws-sdk/lib-dynamodb";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import {
    CognitoIdentityProviderClient,
    AdminGetUserCommand,
    ListUsersCommand,
    AdminCreateUserCommand,
    AdminSetUserPasswordCommand,
    AdminAddUserToGroupCommand,
    AdminDeleteUserCommand
  } from "@aws-sdk/client-cognito-identity-provider";
//import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import {SSMClient, GetParameterCommand} from "@aws-sdk/client-ssm";

const clientCog = new CognitoIdentityProviderClient({});
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const ssmClient = new SSMClient({});

const userPoolSSM='RAPIDCCCognitoUserPoolId';
const clientIdUserPoolSSM='RAPIDCCCognitoClientId';

export class Utils {



    env="";
    userPool;
    clientId;
    params={};
    cogUsers=[];



    setEnv(e) {
        this.env=e;
    }
    setUserPool(p) {
        this.userPool=p;
    }
   


   getEnv() {
    return this.env;
   }

   getUserPool() {
    return this.userPool;
   }

   getOutputFileName() {
    return this.outputFileName;
   }

   getUrl() {
     return this.url;
   }

   getBaseBucket() {
    return this.baseBucket;
   }

   getBucketRealName (baseBucketOutput,env) {
    let bucket = baseBucketOutput;
    if (env !== "none") {
        bucket =`${baseBucketOutput}-${env}`;
    }

    return bucket;

  }


    httpRes (statusCode, body) {
        return {
            'statusCode': statusCode,
            'headers': { 'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*"},
            'body': JSON.stringify(body)
        };
    }

    async createCognitoUser (user) {
        const ts = new Date();
        let data={};
        console.log ("Creating user: " + JSON.stringify(user) + " : " + ts.toDateString() + " : " + this.userPool);

        try {
                const command = new AdminCreateUserCommand({
                    UserPoolId: this.userPool,
                    Username: user.username,
                    ForceAliasCreation: false,
                    MessageAction: "SUPPRESS",
                    UserAttributes: [
                        {
                            Name: 'email', /* required */
                            Value: user.email
                        },
                        {
                            Name: 'email_verified', /* required */
                            Value: "true"
                        },
                        {
                            Name:'custom:firstName',
                            Value: user.firstName,
                        },
                        {
                            Name:'custom:lastName',
                            Value: user.lastName,
                        },
                        {
                            Name:'custom:prefix',
                            Value: user.prefix ? user.prefix : '',
                        },
                        {
                            Name:'custom:suffix',
                            Value: user.suffix ? user.suffix : '',
                        },
                        {
                            Name:'custom:middleName',
                            Value: user.middlename ?    user.middlename : '',
                        },
                        {
                            Name:'custom:phone',
                            Value: user.phone,
                        },
                        {
                            Name:'custom:phone2',
                            Value: user.phone2 ? user.phone2 : '',
                        },
                        {
                            Name:'custom:state',
                            Value: user.state,
                        },
                        {
                            Name:'custom:street1',
                            Value: user.street1,
                        },
                        {
                            Name:'custom:street2',
                            Value: user.street2 ? user.street2 : '',
                        },
                        {
                            Name:'custom:zip',
                            Value: user.zip,
                        },
                        {
                            Name:'custom:city',
                            Value: user.city,
                        },
                        {
                            Name:'custom:apt',
                            Value: user.apt ? user.apt : '',
                        },
                        {
                            Name:'custom:confirmEmail',
                            Value: user.confirmEmail ? user.confirmEmail : '',
                        },
                        {
                            Name:'custom:challengeQuestion',
                            Value: user.challengeQuestion ? user.challengeQuestion : '',
                        },
                        {
                            Name:'custom:challengeAnswer',
                            Value: user.challengeAnswer ? user.challengeAnswer : '',
                        },
                        {
                            Name:'custom:lastSavedDate',
                            Value: ts.toDateString(),
                        },
                    ]
                });

                data= await clientCog.send(command);
                console.log (`Adding ${user.username} : results ` + JSON.stringify(data));
            } catch (e) {
                console.error ("ERROR creating user: " + user.username + " : " + e);
                throw e;
            }

        return data;

  }

  async setPassword (user) {
    let data={};
    try {
        const command = new AdminSetUserPasswordCommand({
            UserPoolId: this.userPool,
            Username: user.username,
            Password: user.password,
            Permanent: true
        });

        data= await clientCog.send(command);
        console.log (`Setting password for ${user.username} : results ` + JSON.stringify(data));
    }catch (e) {
        console.error ("ERROR setting password for user: " + user.username + " : " + e);
        throw e;
    }

    return data;
  }

  async setGroups (user,role) { 
    let data={};
    try {

            const command = new AdminAddUserToGroupCommand({
                UserPoolId: this.userPool,
                Username: user.username,
                GroupName: role
            });

            let data= await clientCog.send(command);
            console.log (`Adding ${user.username} to ${role} : results ` + JSON.stringify(data));
    } catch (e) {
        console.error ("ERROR adding user to group: " + user.username + " : " + e);
        throw e;
    }

    return data;

  }

  async deleteUser (username) {
    let data={};
    try {
        const command = new AdminDeleteUserCommand({
            UserPoolId: this.userPool,
            Username: username
        });

        data= await clientCog.send(command);
        console.log (`Deleting ${username} : results ` + JSON.stringify(data));
    } catch (e) {
        console.error ("ERROR deleting user: " + username + " : " + e);
        throw e;
    }

    return data;
  }
  

  async getUserPool () {

        const input = {
            Name: userPoolSSM
        }

        const command = new GetParameterCommand(input);

        try {
        const res = await ssmClient.send(command);
        this.userPool = res.Parameter.Value;
        } catch (e) {
            console.error (`Error on retrieving ${userPoolSSM} : ${e}`);
        }

        console.log ("UserPool: " + this.userPool);
        
        return this.userPool;
  }

  async getClientId () {

        const input = {
            Name: clientIdUserPoolSSM
        }

        const command = new GetParameterCommand(input);

        try {
        const res = await  ssmClient.send(command);
        this.clientId = res.Parameter.Value;
        } catch (e) {
            console.error (`Error on retrieving ${clientIdUserPoolSSM} : ${e}`);
        }

        console.log ("ClientId for UserPool " + this.clientId);
        
        return this.clientId;
  }

  async getEmailForUserName (username)  {

    if (this.userPool === null) {
        console.error ("UserPool is null returning user: " + user);
        return user;
    }

    let email="";

    try {
        const getAttribute = (attributes,key) => {
            const attribute = attributes.find(x=>x.Name === key);
            return attribute ? attribute.Value : '';
        };

    

        const command = new AdminGetUserCommand({
            UserPoolId: this.userPool,
            Username: username,
        });

        let data= await clientCog.send(command);

         email= getAttribute (data['UserAttributes'],"email");
 
    } catch (e) {
             console.error ("ERROR processing: " + username + " : " + e);
    }
 

    return  email;
}

getEmailFromList (username) {
        let email="";
    
        if (this.cogUsers !== undefined) {
            try {
                
                let user = this.cogUsers.find (x=>x.Username === username);
                if (user) {
                    email = user ? user.Attributes.find(x=>x.Name == 'email').Value : '';
                }
        
            } catch (e) {
                    console.error ("ERROR processing: " + username + " : " + e);
            }
    
        }
    
        return  email;
    }

    async listPoolUsers () {



        try {
            this.cogUsers=[];
            let cogData;
            let token="";
            let command;
            do {

                if (token === "") {
                        command = new ListUsersCommand({
                            UserPoolId: this.userPool,
                            AttributesToGet: ["email"],
                        });
                }
                else {
                        command = new ListUsersCommand({
                            UserPoolId: this.userPool,
                            AttributesToGet: ["email"],
                            PaginationToken: token
                        });

                }
                cogData = await clientCog.send(command);
                this.cogUsers = this.cogUsers.concat(cogData.Users);
                token = cogData.PaginationToken;

            } while (cogData.PaginationToken !== undefined);

            console.log ("Found: " + this.cogUsers.length + " users"  );

        } catch (e) {
            console.error ("ERROR listing users: " + e);
        }
     
       return this.cogUsers;
    }





    async getBucketData (bucket, key) {

        const s3ClientRead = new S3Client({});

        let bucketData=null;
  
           const command = new GetObjectCommand({
                 Bucket: bucket,
                 Key: key,
           });
     
           try {
     
               let proInfoDataIn = await s3ClientRead.send(command);
               let outData =  await proInfoDataIn.Body.transformToString();
                bucketData = JSON.parse(outData);
             
     
      
           } catch (e) {
               console.error ("GETBUCKETDATA Error : " + key + " : " + bucket + " : "  +e);
           }
           finally {
            s3ClientRead.destroy();
           }
     
        
         return bucketData;
     

    }


  
    async saveToS3 (bucketName, fileName, fileData) {

        const s3ClientWrite = new S3Client({});

       console.log ("SAVE TO S3: " + bucketName + " : " + fileName + " data: " + fileData + " : " + this.retryS3 );
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: fileData,
        });
        
        try {
            const response = await s3ClientWrite.send(command);
            console.log("SAVE TO S3: saved " + bucketName + " : " + fileName);
        } catch (err) {
            console.error("ERROR SAVING TO S3 - saved " + bucketName + " : " + fileName + " : " + err);     
        }
        finally {
            s3ClientWrite.destroy();
        }
    }



}