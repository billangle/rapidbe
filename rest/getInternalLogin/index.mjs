import {
    AuthFlowType,
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
  } from "@aws-sdk/client-cognito-identity-provider";
  import { Utils } from "/opt/nodejs/Utils.mjs";
  let utils = new Utils();
  

  

  const getLoginToken = async ( username, password, clientId) => {
    const client = new CognitoIdentityProviderClient({});
  
    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
      ClientId: clientId ,
    });
  
    return await client.send(command);
  };

  

  
export const handler = async (event, context, call) => {

    let proEnv='none';

    try {
            proEnv = event.stageVariables.proenvironment;
    } catch (e) {console.log("error " + JSON.stringify(e))}


    let username =  decodeURIComponent(event.pathParameters.username);
    let password = decodeURIComponent(event.pathParameters.password);
    
    const clientId = await utils.getClientId();
    console.log ("Internal Login: username: " + username + " ClientId: " + clientId + " password: " + password);

    
  try {
        let data=await getLoginToken (username,password,clientId);
        console.log ("InternalLogin: data: " + JSON.stringify(data));
        let token= data.AuthenticationResult.IdToken;
        let other= data.AuthenticationResult.AccessToken;
    

        console.log ("InternalLogin: username: " + username + " TOKEN: " + token);

        let tokenOutput={
            "username": username,
            "token": token
        }

        let res2 = {
            'statusCode': 200,
            'headers': { 'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*"},
            'body': JSON.stringify(tokenOutput)
        }
        
        return res2;

    } catch (error){
        
        console.log ("InternetLogin: Caught error on login" + error);
        let fail = {
            'statusCode': 404,
            'headers': { 'Content-Type': 'application/json', 
            "Access-Control-Allow-Origin": "*", 
            "Cache-Control": "no-store, no-cache, must-revalidate"}, 
            'body': JSON.stringify({
                "login": "failed",
                "error": error.message
            })
        }

        return fail;
    }
}