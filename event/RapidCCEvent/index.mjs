import { PutObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs"; 
import {SSMClient, GetParameterCommand} from "@aws-sdk/client-ssm";

const client = new S3Client({});
const sqsClient = new SQSClient({});
const ssmClient = new SSMClient({});


const checkKey = async(myKey, myBucket) => {

    let exists = false;
    const command = new GetObjectCommand({
        Bucket: myBucket,
        Key:myKey,
      });
    
      try {
        const response = await client.send(command);
        // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
        const str = await response.Body.transformToString();
       // console.log(str);
        exists=true;
      } catch (err) {
        //console.log("Key not found: " + myKey);
      }

       return exists;
}

const getSSMQUrlReportParm = async(reportType) => {

    let queueUrl="NA";
    const input = {
        Name: `${reportType}QUrlSSM`
    }

    const command = new GetParameterCommand(input);

    try {
      const res = await ssmClient.send(command);
      queueUrl = res.Parameter.Value;

    } catch (e) {
        console.error ("ERROR on SSM: " + reportType + " : " + e);
    }


    return queueUrl;
}

const getSSMQUrlEMailParm = async() => {

    let queueUrl="NA";
    const input = {
        Name: "ReportAPIQEMailSSM"
    }

    const command = new GetParameterCommand(input);

    try {
      const res = await ssmClient.send(command);
      queueUrl = res.Parameter.Value;

    } catch (e) {
        console.error ("ERROR on EMAIL SSM: " + reportType + " : " + e);
    }


    return queueUrl;
}

const getSSMQUrlManyEMailParm = async() => {

    let queueUrl="NA";
    const input = {
        Name: "ReportManyAPIQEMailSSM"
    }

    const command = new GetParameterCommand(input);

    try {
      const res = await ssmClient.send(command);
      queueUrl = res.Parameter.Value;

    } catch (e) {
        console.error ("ERROR on EMAIL SSM: " + reportType + " : " + e);
    }


    return queueUrl;
}

const getSSMQUrlWebhookParm = async() => {

    let queueUrl="NA";
    const input = {
        Name: "ReportAPIQWebhookSSM"
    }

    const command = new GetParameterCommand(input);

    try {
      const res = await ssmClient.send(command);
      queueUrl = res.Parameter.Value;

    } catch (e) {
        console.error ("ERROR on WEBHOOK SSM: " + reportType + " : " + e);
    }


    return queueUrl;
}

const sendSQSManyEMailMessage= async(uuid,report,key, email, env) => {

    let res={};
    let theQueue="";


    let ssmQueue = await getSSMQUrlManyEMailParm ();

    if (ssmQueue !== "NA") {
        theQueue = ssmQueue;
    }
   
    console.log ("Queue: " + theQueue + " MANY EMAIL Report: " + report);

    const message = {
        uuid: uuid,
        report: report,
        key: key,
        email: email,
        env: env
    }

    const input = {
        QueueUrl: theQueue,
        MessageBody: JSON.stringify (message),
        DelaySeconds: 0,
        MessageDuplicationId: uuid,
        MessageGroupId: email
    }

    try {
        const command = new SendMessageCommand(input);
        res = await sqsClient.send (command);

        console.log ("SQS MANY EMAIL RES: " + JSON.stringify(res));
    } catch (e) {
        console.error ("SQS MANY EMAIL SEND ERROR: " + JSON.stringify(input) + " e: " + e);
    }
    
    return res;
}

const sendSQSEMailMessage= async(uuid,report,key, email, env) => {

    let res={};
    let theQueue="";


    let ssmQueue = await getSSMQUrlEMailParm ();

    if (ssmQueue !== "NA") {
        theQueue = ssmQueue;
    }
   
    console.log ("Queue: " + theQueue + " EMAIL Report: " + report);

    const message = {
        uuid: uuid,
        report: report,
        key: key,
        email: email,
        env: env
    }

    const input = {
        QueueUrl: theQueue,
        MessageBody: JSON.stringify (message),
        DelaySeconds: 0,
        MessageDuplicationId: uuid,
        MessageGroupId: email
    }

    try {
        const command = new SendMessageCommand(input);
        res = await sqsClient.send (command);

        console.log ("SQS EMAIL RES: " + JSON.stringify(res));
    } catch (e) {
        console.error ("SQS EMAIL SEND ERROR: " + JSON.stringify(input) + " e: " + e);
    }
    
    return res;
}


const sendSQSWebhookMessage= async(uuid,report,key, env, outputType, url) => {

    let res={};
    let theQueue="";


    let ssmQueue = await getSSMQUrlWebhookParm ();

    if (ssmQueue !== "NA") {
        theQueue = ssmQueue;
    }
   
    console.log ("Queue: " + theQueue + " Webhook: " + report);

    const message = {
        uuid: uuid,
        report: report,
        key: key,
        env: env,
        outputType: outputType,
        url: url
    }

    const input = {
        QueueUrl: theQueue,
        MessageBody: JSON.stringify (message),
        DelaySeconds: 0,
        MessageDuplicationId: uuid,
        MessageGroupId: report
    }

    try {
        const command = new SendMessageCommand(input);
        res = await sqsClient.send (command);

        console.log ("SQS Webhook RES: " + JSON.stringify(res));
    } catch (e) {
        console.error ("SQS Webhook SEND ERROR: " + JSON.stringify(input) + " e: " + e);
    }
    
    return res;
}


const sendSQSReportMessage= async(uuid,report,key, email, env) => {

    let res={};
    let theQueue="";
    let ssmQueue = await getSSMQUrlReportParm (report);

    if (ssmQueue !== "NA") {
        theQueue = ssmQueue;
    }

    console.log ("Queue: " + theQueue + " Report: " + report);

    const message = {
        uuid: uuid,
        report: report,
        key: key,
        email: email,
        env: env
    }

    const input = {
        QueueUrl: theQueue,
        MessageBody: JSON.stringify (message),
        DelaySeconds: 0,
        MessageDuplicationId: uuid,
        MessageGroupId: email
    }

    try {
        const command = new SendMessageCommand(input);
        res = await sqsClient.send (command);

        console.log ("SQS RES: " + JSON.stringify(res));
    } catch (e) {
        console.error ("SQS SEND ERROR: " + JSON.stringify(input) + " e: " + e);
    }
    
    return res;
}

export const handler = async (event, context, call) => {

    console.log ("DYNA EVENT DATA: " + JSON.stringify(event));
    let eventName = event.Records[0].eventName;


    if (eventName !== "INSERT" && eventName !== "MODIFY")  {
        console.log("NOT AN INSERT OR UPDATE");
    }
    else {

        let uuid = event.Records[0].dynamodb.Keys.UUID.S;
        let rType = event.Records[0].dynamodb.Keys.ReportType.S;
      
        let proEnv = event.Records[0].dynamodb.NewImage.Environment.S;
        let webhook = event.Records[0].dynamodb.NewImage.Webhook.BOOL;
        let url = event.Records[0].dynamodb.NewImage.Url.S;
        let outputType = event.Records[0].dynamodb.NewImage.OutputType.S;

        let email="na";
    try {
        if (event.Records[0].dynamodb.NewImage.ResultEmail.S !== undefined) {
            email =event.Records[0].dynamodb.NewImage.ResultEmail.S;
        }
    } catch (xxx) {}



        let baseBucket= "prosams-reportapi-output";
        let bucketName = baseBucket + "-" + proEnv;
            

        console.log ("EVENT ROWS: " + event.Records.length);

        let key =`ReportEvents/${rType}/DYNAEVENT-${eventName}-${rType}-${uuid}.json`;

            let exists = await checkKey (key,bucketName);
            if (!exists) {

                    const command = new PutObjectCommand({
                        Bucket: bucketName,
                        Key: key,
                        Body: JSON.stringify(event),
                    });
                    
                    try {
                        const response = await client.send(command);
                    // console.log(response);
                    } catch (err) {
                        console.error("DYNAEVENT: ERROR CREATING KEY: " + key + " e: " +err);
                    }

                    if (eventName === "INSERT") {
                        const sqs = await sendSQSReportMessage (uuid,rType,key,email, proEnv);
                    }
                    else if (eventName === "MODIFY") {
                    //TODO: check if email exists when finding a webhook - we could do both here
                    /** current implementation is either webhook or email not both */
                       if (webhook) {
                           console.log ("DYNA EVENT GOT HOOK: " + webhook);
                           const hook = await sendSQSWebhookMessage (uuid,rType,key,proEnv,outputType,url);
                       } 
                       else {
                          console.log ("DYNA EVENT: sending email: " + email);
                          if (rType === "SPARReport") {
                            const sqsEmail = await sendSQSManyEMailMessage (uuid,rType,key,email,proEnv);
                          }
                          else {
                              const sqsEmail = await sendSQSEMailMessage (uuid,rType,key,email,proEnv);
                          }

                       }
                    }
            }
            else {
                console.log ("DYNAEVENT: KEY EXISTS: " + key);
            }
        }
   
}