import sesClientModule from "@aws-sdk/client-ses";
import {
	DynamoDBClient,
	PutItemCommand,
	GetItemCommand, 
} from "@aws-sdk/client-dynamodb";
import {
    ExecuteStatementCommand,
    DynamoDBDocumentClient,
    UpdateCommand
} from "@aws-sdk/lib-dynamodb";
import {
	marshall,
	unmarshall
} from "@aws-sdk/util-dynamodb";
import nodemailer from "nodemailer";
import {v4 as uuidv4} from 'uuid'; 
import { Utils } from "/opt/nodejs/Utils.mjs";
let utils = new Utils();


const dynamoClient= new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

let env;

// RapidCCEvents
// UUID - DocType
/*
const checkForUsername = async (email, username, name, docType, docData, proEnv) => {
   let dataR;

    try {
        let commandR = new ExecuteStatementCommand({
            Statement: `select UUID,ResultEmail, MyCount from "RapidCCEvents"."UUID-Username-index" where Username=?`,
            Parameters: [username]
        });
        
        dataR = await docClient.send(commandR);
    } catch (e) {
        console.error ("Error getting EVENTS: " +e);
    }

    console.log("dataR: ", dataR);

    if (dataR.Items.length !==0 ) {
        let theCount = dataR.Items[0].MyCount;
        let res = await updateRequestData(dataR.Items[0].UUID, docType, theCount+1, docData);
        return res;
     }
     else {
       let res2=  await saveRequestData(email, username, name, docType, docData, proEnv);
       return res2;
     }

}
     */

const checkForDocType = async ( docType) => {
    let dataR;
    let myts=new Date();
    let formattedDate = getFormattedDate(myts);
    let myuuid = `${formattedDate}:${docType}`;
 
     try {
         let commandR = new ExecuteStatementCommand({
             Statement: `select UUID,DocType,MyCount from RapidCCEvents where UUID=?`,
             Parameters: [myuuid]
         });
         
         dataR = await docClient.send(commandR);
     } catch (e) {
         console.error ("Error getting EVENTS: " +e);
     }
 
     console.log("dataR: ", dataR);
 
     if (dataR.Items.length !==0 ) {
         let theCount = dataR.Items[0].MyCount;
         let res = await updateRequestData(dataR.Items[0].UUID, docType, theCount+1);
         return res;
      }
      else {
       
        let res2=  await saveRequestDataCount(docType);
        return res2;
      }
 
 }
 

const updateRequestData = async (uuid, docType, count) => {
    let commandR;
    let myts=new Date();
    let formattedDate = getFormattedDate(myts);
    let res;
    try {
    
        commandR = new UpdateCommand({
            TableName: "RapidCCEvents",
            Key: {
              UUID: uuid,
              DocType: docType
            },
            UpdateExpression: "set MyCount = :count, MyTS = :myts",
            ExpressionAttributeValues: {
              ":count": count,
              ":myts": formattedDate
            },
            ReturnValues: "ALL_NEW",
          });
        
          res = await docClient.send(commandR);
    } catch (e) {
        console.error("Error updating row: " + uuid + " : " + JSON.stringify(commandR) + " e: " + e);
    }
    
    return res;

}

function getFormattedDate(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
  
    return month + '/' + day + '/' + year;
}


function getFormattedDateTime(date) {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');

  return month + '/' + day + '/' + year + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}

 
const saveRequestDataCount = async(docType) => {

  let res;
  let myts=new Date();
  let formattedDate = getFormattedDate(myts);
  let myuuid = `${formattedDate}:${docType}`;

  let tableName="RapidCCEvents";
 

  const putItem = new PutItemCommand({
      TableName: tableName,
      Item: marshall({
          UUID: myuuid,
          DocType: docType,
          MyCount: 1,
          MyTS: formattedDate

      })
  });


  try {
     res = await dynamoClient.send(putItem);
  } catch (e) {
      console.error ("ERROR in saveRequestDataCount:  : " + docType + " : " + myuuid + "e: " + e);
  }



   return res;
}


const saveRequestData = async(userEmail, userName, name, docType, inData, proEnv) => {

    let res;
    let myts=new Date();
    let formattedDate = getFormattedDateTime(myts);
    //let myuuid = `${formattedDate}:${docType}`;
    let myuuid = uuidv4();
    let tableName="RAPIDCCEmailEvents";

    console.log("Data IN TABLE: saveRequestData:  uuid: " + myuuid + " inData: " + JSON.stringify(inData));
   

    const putItem = new PutItemCommand({
        TableName: tableName,
        Item: marshall({
            UUID: myuuid,
            Email: userEmail,
            Username: userName,
            Name: name,
            DocType: docType,
            MyTS: formattedDate,
            DataDoc: inData,
            ProEnv: proEnv
  
        })
    });


    try {
       res = await dynamoClient.send(putItem);
    } catch (e) {
        console.error ("ERROR in saveRequestData:  : e: " + e);
    }


     return res;
  }



/**
 * nodemailer wraps the SES SDK and calls SendRawEmail. Use this for more advanced
 * functionality like adding attachments to your email.
 *
 * 
 * 
 * https://nodemailer.com/transports/ses/
 */



const sendEmail =  async(from, to, region, subject, msg) => {
  const ses = new sesClientModule.SESClient({region: region});
  const transporter = nodemailer.createTransport({
    SES: { ses, aws: sesClientModule },
  });

  console.log ("Starting to send email to " + to + " from " + from + " with subject " + subject + " and message " + msg);

  return new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from,
        to,
        subject: subject,
        text: `${msg}`,
      },
      (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      },
    );
  });
};



export const handler = async (event, context, call) => {

    let proEnv;
    let userName="";
    let userType="";
    let userEmail="";
    let region="";
    let domain="";
    let name;
    let cityState="";

    let inData;

    try {
        inData = JSON.parse(event.body);
        cityState = `${inData.city}-${inData.state}`;
        if (cityState.indexOf("undefined") !== -1) {
            cityState = `${inData.data.city}-${inData.data.state}`;
        }
    } catch(e) {
        inData = JSON.parse("{}");
    }

    console.log ("InData: " + JSON.stringify(inData));

    try {
        proEnv = event.stageVariables.proenvironment;
        region = event.stageVariables.proregion;
        domain = event.stageVariables.prodomain;
        userName = event.requestContext.authorizer.claims["cognito:username"];
        userType = event.requestContext.authorizer.claims["cognito:groups"];
        userEmail = event.requestContext.authorizer.claims["email"];
        name = `${event.requestContext.authorizer.claims['custom:prefix'] || ''} ${event.requestContext.authorizer.claims['custom:firstName']} ${event.requestContext.authorizer.claims['custom:middleName'] || ''} ${event.requestContext.authorizer.claims['custom:lastName']} ${event.requestContext.authorizer.claims['custom:suffix'] || ''}`;

   
        if (cityState === "") {
            cityState = `${event.requestContext.authorizer.claims['custom:city']}-${event.requestContext.authorizer.claims['custom:state']}`;
        }
        console.log ("ProEnv: " + proEnv + " Region: " + region + " Domain: " + domain + " User: " + userName + " Email: " + userEmail + " Type: " + userType + " name: " + name);

        let subject="Identity Theft Monitoring Enabled"
        let msg =`${name} identity theft monitoring has been enabled for username: ${userName} and email: ${userEmail}. City and state ${cityState}. If you did not enable this please contact support immediately.`;
        let fromEmail = `admin@email.${domain}`;
        let toEmailList = [userEmail];

        // turning off the email to test genertaing random users
        //let res = await sendEmail(fromEmail, toEmailList, region, subject, msg);
        let res="Email sent: " + fromEmail + " to " + toEmailList + " with subject " + subject + " and message " + msg;
        

         console.log ("Result: " +res);
        let data2 = await saveRequestData(userEmail, userName, name, "ServiceEmail-IdTheftEnabled", inData, proEnv);
        let data = await checkForDocType(cityState);


        return utils.httpRes(200, {
         //   "result": res.messageId
            "result": res
        });

    } catch (error) {
        console.error ("Caught error: " + error);
        return utils.httpRes(404,{
            "ServiceEmail": "failed",
            "error": error.message
        });
    }

   

}