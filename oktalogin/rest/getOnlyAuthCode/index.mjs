import {
	DynamoDBClient
} from "@aws-sdk/client-dynamodb";
import {
    ExecuteStatementCommand,
    DynamoDBDocumentClient
} from "@aws-sdk/lib-dynamodb";


const dynamoClient= new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);


function  httpRes (statusCode, body) {
    return {
        'statusCode': statusCode,
        'headers': { 'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*"},
        'body': body
    };
}

  const checkForEmailAddress = async ( emailAddress) => {
        let dataR;
    
     
         try {
             let commandR = new ExecuteStatementCommand({
                 Statement: `select * from OktaQAMessages where EmailAddress=?`,
                 Parameters: [emailAddress]
             });
             
             dataR = await docClient.send(commandR);
         } catch (e) {
             console.error ("Error EmailAdress: " + emailAddress + " : " +e);
         }
     
         console.log("Found Data for EmailAddress ", dataR);

         if (dataR.Items.length !==0 ) {
            
             return dataR.Items[0];
          }
          else {
      
            return {
                EmailAddress: emailAddress,
                VerificationCode: "",
                CodeDateTime: "",
                CodeTS: "",
                EmailSystem: "",
                MessageId: "",  
                MessageBody: ""
            };
          }
     
     }

export const handler  = async (event, context, callback)  => {
    try {

        let emailAddress =  decodeURIComponent(event.pathParameters.email);
 
        let res = await checkForEmailAddress(emailAddress);
        console.log("Found Data for EmailAddress " +  res + " : " + JSON.stringify(res));
        console.log("Found code: " + res.VerificationCode);

        return httpRes(200, res.VerificationCode);
       
      

    } catch (error){

        console.log ("Okta QA Caught error: " + error);
        return httpRes(404,{
            "getOktaAuthCode": "failed",
            "error": error.message
        });
       
    }

};
