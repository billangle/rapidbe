import { PutObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs"; 
import {SSMClient, GetParameterCommand} from "@aws-sdk/client-ssm";

const client = new S3Client({});
const sqsClient = new SQSClient({});
const ssmClient = new SSMClient({});
const domain="rapidright.net";


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








export const handler = async (event, context, call) => {

    console.log ("DYNA EVENT DATA: " + JSON.stringify(event));
    let eventName = event.Records[0].eventName;


    if (eventName !== "INSERT" && eventName !== "MODIFY")  {
        console.log("NOT AN INSERT OR UPDATE");
    }
    else {

        let uuid = event.Records[0].dynamodb.Keys.UUID.S;
        let email = event.Records[0].dynamodb.Keys.Email.S;
      
        let proEnv = event.Records[0].dynamodb.NewImage.ProEnv.S;
        let ts = event.Records[0].dynamodb.NewImage.MyTS.S;
        let docData = event.Records[0].dynamodb.NewImage;
        let docType = event.Records[0].dynamodb.NewImage.DocType.S;

        let ts2=ts.replaceAll("/","-");
        let tsDate = ts2.split(" ");




        //let baseBucket= "rapidcc-userdata-output2";
        let baseBucket= `${domain}-userdata-output`;
        let bucketName = baseBucket + "-" + proEnv;

        /*
        Data from Dynamodb:
                    {
            "DataDoc": {
                "M": {
                "zip": { "S": "35005" },
                "city": { "S": "Birmingham" },
                "companyName": { "S": "REI Systems" },
                "street1": { "S": "111 Any Street" },
                "aptsuite": { "S": "" },
                "state": { "S": "AL" },
                "title": { "S": "any " },
                "salary": { "S": "111" },
                "SSN": { "S": "1111" }
                }
            },
            "Email": { "S": "william.beckett+rapidtest@reisystems.com" },
            "Username": { "S": "rapid.test" },
            "UUID": { "S": "5de4cf9e-0610-4ea5-b06b-edb4582b5260" },
            "ProEnv": { "S": "prod" },
            "DocType": { "S": "ServiceEmail-IdTheftEnabled" },
            "MyTS": { "S": "02/24/2025 15:25:57" },
            "Name": { "S": "Mr. Rapid Middle Test Jr." }
            }
  */

        let theActualData =  event.Records[0].dynamodb.NewImage.DataDoc.M


         console.log ("the actual data: " + JSON.stringify(theActualData)  );    

/*
         let idDataRow = {
            UUID: uuid,
            Email: email,   
            DocType: docType,
            MyTS: ts,
            Name: docData.Name.S,
            Username: docData.Username.S,
            ProEnv: proEnv,
            zip: docData.DataDoc.M.data.M.zip.S,
            city: docData.DataDoc.M.data.M.city.S,
            companyName: docData.DataDoc.M.data.M.companyName.S,
            street1: docData.DataDoc.M.data.M.street1.S,
            state: docData.DataDoc.M.data.M.state.S,
            title: docData.DataDoc.M.data.M.title.S,
            salary: docData.DataDoc.M.data.M.salary.N, 
            SSN: docData.DataDoc.M.data.M.SSN.S
            

        };
        */

        let idDataRow = {
            UUID: uuid,
            Email: email,   
            DocType: docType,
            MyTS: ts,
            Name: docData.Name.S,
            Username: docData.Username.S,
            ProEnv: proEnv,
            zip: theActualData.zip.S,
            city: theActualData.city.S,
            companyName: theActualData.companyName.S,
            street1: theActualData.street1.S,
            state: theActualData.state.S,
            title: theActualData.title.S,
            salary: theActualData.salary.N, 
            SSN: theActualData.SSN.S
     

        };
            

        console.log ("EVENT DATA for S3: " + event.Records.length + " idDataRow: " + JSON.stringify(idDataRow));    

        let key =`${docType}/${tsDate[0]}/${uuid}-${email}.json`;
        console.log ("S3 Key: " + key + " bucket: " + bucketName + " data: " + JSON.stringify(idDataRow));

            let exists = await checkKey (key,bucketName);
            if (!exists) {

                    const command = new PutObjectCommand({
                        Bucket: bucketName,
                        Key: key,
                        Body: JSON.stringify(idDataRow), // docData,
                    });
                    
                    try {
                        const response = await client.send(command);
                    // console.log(response);
                    } catch (err) {
                        console.error("DYNAEVENT: ERROR CREATING KEY: " + key + " e: " +err);
                    }

                   
            }
            else {
                console.log ("DYNAEVENT: KEY EXISTS: " + key);
            }
        }
   
}