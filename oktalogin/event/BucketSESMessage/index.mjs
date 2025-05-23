import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

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
import {v4 as uuidv4} from 'uuid'; 


const dynamoClient= new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

let basePath="./"   
let fileContent="";
let boundaryName="";


const findMimeBoundary = async()  => {

//  const filePath = path.join(basePath, 'testemail');
 // const fileBuffer = await fs.readFile(filePath);
 // fileContent = fileBuffer.toString();
  const boundaryRegex = /boundary="([^"]+)"/;
  //const match = fileContent.match(boundaryRegex);
  const match = fileContent.match(boundaryRegex);
  if (match) {
    const boundaryName = match[1];
    //console.log(`MIME boundary name: ${boundaryName}`);
    return  boundaryName;
  } else {
    console.log('No MIME boundary found');
    return "";
  }
}

const parseMimeMessage = async(fileBuffer, boundary) => {

    const boundaryRegex = /boundary="([^"]+)"/;
    const match = fileContent.match(boundaryRegex);
    if (match) {
      const boundaryName = match[1];
      const parts = fileContent.split(`--${boundaryName}`);
      const mimeParts = [];
      for (let i = 1; i < parts.length - 1; i++) {
        const part = parts[i].trim();
        const headers = {};
        const headerRegex = /^([A-Za-z-]+): (.*)$/gm;
        let headerMatch;
        while ((headerMatch = headerRegex.exec(part)) !== null) {
          headers[headerMatch[1].toLowerCase()] = headerMatch[2];
        }
        const body = part.replace(headerRegex, '').trim();
        mimeParts.push({ headers, body });
      }
      return mimeParts;
    } else {
      throw new Error('No MIME boundary found');
    }
    return [];
  }
  
  function extractSixDigitCode(text) {
      const regex = /\b\d{6}\b/;
      const match = text.match(regex);
      if (match) {
        return match[0];
      } else {
        return null;
      }
    }

    function extractDomainName(headers) {
        const urlRegex = /https?:\/\/([^\/]+)/;
        const url = headers['url'] || headers['URL'];
        if (url) {
          const match = url.match(urlRegex);
          if (match) {
            return match[1];
          }
        }
        return null;
      }
    
      function extractEmailAddress(header) {
        const toRegex = /^To: (.*)$/m;
        const match = header.match(toRegex);
        if (match) {
          const emailAddress = match[1].trim();
          return emailAddress;
        }
        return null;
      }
    
      function extractMessageId(header) {
        const messageIdRegex = /^Message-ID: (.*)$/m;
        const match = header.match(messageIdRegex);
        if (match) {
          const messageId = match[1].trim().replace(/<|>/g, '');
          return messageId;
        }
        return null;
      }
    
      function removeLineBreaks(messageBody) {
        return messageBody.replaceAll(/\r\n/g, ' ');
      }

      function getFormattedDate(date) {
        let year = date.getFullYear();
        let month = (1 + date.getMonth()).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
      
        return month + '/' + day + '/' + year;
    }
    
    function getS3PathFormattedDate(date) {
        let year = date.getFullYear();
        let month = (1 + date.getMonth()).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
      
        return month + '-' + day + '-' + year;
    }
    
    function getFormattedDateTime(date) {
      let year = date.getFullYear();
      let month = (1 + date.getMonth()).toString().padStart(2, '0');
      let day = date.getDate().toString().padStart(2, '0');
    
      return month + '/' + day + '/' + year + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }
    
    

    const saveToS3 = async(bucketName, fileName, fileData) => {
    
            const s3ClientWrite = new S3Client({});
    
            console.log ("SAVE TO S3: " + bucketName + " : " + fileName + " data: " + fileData );
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

    function   getBucketRealName (baseBucketOutput,env) {
            let bucket = baseBucketOutput;
            if (env !== "none") {
                bucket =`${baseBucketOutput}-${env}`;
            }
        
            return bucket;
        }

    const getBucketData = async(bucket, key) =>{

            const s3ClientRead = new S3Client({});
    
            let bucketData=null;
      
               const command = new GetObjectCommand({
                     Bucket: bucket,
                     Key: key,
               });
         
               try {
         
                   let proInfoDataIn = await s3ClientRead.send(command);
                   let outData =  await proInfoDataIn.Body.transformToString();
                   // bucketData = JSON.parse(outData);
                   bucketData = outData;
                 
         
          
               } catch (e) {
                   console.error ("GETBUCKETDATA Error : " + key + " : " + bucket + " : "  +e);
               }
               finally {
                s3ClientRead.destroy();
               }
         
            
             return bucketData;
         
    
        }

   const tableName="OktaQAMessages";

    const checkForEmailAddress = async ( s3Data) => {
        let dataR;
        let emailAddress = s3Data.emailAddress;
     
         try {
             let commandR = new ExecuteStatementCommand({
                 Statement: `select * from ${tableName} where EmailAddress=?`,
                 Parameters: [emailAddress]
             });
             
             dataR = await docClient.send(commandR);
         } catch (e) {
             console.error ("Error EmailAdress: " + emailAddress + " : " +e);
         }
     
         console.log("dataR: ", dataR);
     
         if (dataR.Items.length !==0 ) {
             let res = await updateRequestData(dataR.Items[0].UUID, s3Data);
             return res;
          }
          else {
           
            let res2=  await saveRequestData(s3Data);
            return res2;
          }
     
     }
     

    const updateRequestData = async (UUID,s3Data) => {
        let commandR;
        let res;
        let myts=new Date();
        let formattedDate = getFormattedDateTime(myts);
        try {
        
            commandR = new UpdateCommand({
                TableName: tableName,
                Key: {
                  UUID: UUID,
                  EmailAddress: s3Data.emailAddress,
                },
                UpdateExpression: "set VerificationCode = :verificationCode, MessageBody = :msgBody, " +
                                  " CodeDateTime = :codeDateTime, CodeTS = :codeTS, EmailSystem = :EmailSystem, MessageId = :messageId",
                ExpressionAttributeValues: {
                  ":messageId": s3Data.emailAddress,
                  ":verificationCode": s3Data.verificationCode,
                  ":msgBody": s3Data.body,
                  ":codeDateTime": formattedDate,
                  ":codeTS": Date.now(),
                  ":EmailSystem": s3Data.applicationDomain,
                },
                ReturnValues: "ALL_NEW",
              });
            
              res = await docClient.send(commandR);
        } catch (e) {
            console.error("Error updating row: " + UUID + " : " + JSON.stringify(commandR) + " e: " + e);
        }
        
        return res;
    
    }
  
        
    const saveRequestData = async(s3Data) => {
    
        let res;
        let myts=new Date();
        let formattedDate = getFormattedDateTime(myts);
        let tableName="OktaQAMessages";
        let myuuid = uuidv4();
    
        console.log("Data IN TABLE: saveRequestData: " + JSON.stringify(s3Data) + " UUID: " + myuuid);
        
    
        const putItem = new PutItemCommand({
            TableName: tableName,
            Item: marshall({
                UUID: myuuid,
                MessageId: s3Data.messageId,
                EmailSystem: s3Data.applicationDomain,
                EmailAddress: s3Data.emailAddress,
                VerificationCode: s3Data.verificationCode,
                MessageBody: s3Data.body,
                CodeDateTime: formattedDate,
                CodeTS: Date.now()
            })
        });
    
    
        try {
            res = await dynamoClient.send(putItem);
        } catch (e) {
            console.error ("ERROR in saveRequestData:  : e: " + e);
        }
    
    
            return res;
        }


    const processS3BucketData = async(bucketData, bucketName) => {

        let myts=new Date();
        let formattedDate = getS3PathFormattedDate(myts);
        boundaryName = await findMimeBoundary();

        const mimeParts = await parseMimeMessage(fileContent, boundaryName);
        const sixDigitCode = extractSixDigitCode(mimeParts[0].body)
        const domainName = extractDomainName(mimeParts[0].headers);
        const emailAddress = extractEmailAddress(fileContent);
        const messageId = extractMessageId(fileContent);
        const resultData = {
            "verificationCode": sixDigitCode,
            "applicationDomain": domainName,
            "emailAddress": emailAddress,
            "messageId": messageId,
            "body": removeLineBreaks(mimeParts[0].body), //mimeParts[0].body
        }
    
        const s3FileNmae = `${formattedDate}/${emailAddress}-${messageId}.json`;
        const res = await saveToS3(bucketName, s3FileNmae, JSON.stringify(resultData));
        //const dynaRes = await saveRequestData(resultData);
        const emailRes = await checkForEmailAddress(resultData);

        console.log("S3 Bukcet: " + bucketName + " : " + s3FileNmae + " data: " + JSON.stringify(resultData));   

    }

export const handler  = async (event, context, callback)  => {
    try {

        /*
        proEnv = event.stageVariables.proenvironment;
        region = event.stageVariables.proregion;
        domain = event.stageVariables.prodomain;
        */

        let myts=new Date();
        let formattedDate = getFormattedDate(myts);

       // const baseBucketName ="dmdc-okta-qa-messages";
       // const bucketName = getBucketRealName(baseBucketName,proEnv);

        const baseBucketName ="dmdc-okta-qa-messages";

      
      
        console.log('Okta QA Message Event: ', JSON.stringify(event));

        let records = event.Records;

        for (let i = 0; i < records.length; i++) {
            let bucketName = records[i].s3.bucket.name;
            let objKey = records[i].s3.object.key;
            if (objKey.indexOf("AMAZON_SES_SETUP_NOTIFICATION")== -1) {
                let bucketData = await getBucketData(bucketName, objKey);
                console.log("BUCKET DATA: " + bucketData);
                fileContent = bucketData;
                await processS3BucketData(bucketData, bucketName);
            }

        }

       // let data = event.Records[0].ses.mail;

        //console.log('Okta QA Message Data: ', data);
    
       // fileContent = data;
       
      

    } catch (error){

        console.log ("Okta QA Caught error: " + error);
       
    }

};
