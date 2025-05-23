import {
    ExecuteStatementCommand,
    DynamoDBDocumentClient,
  } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Utils } from "/opt/nodejs/Utils.mjs";
let utils = new Utils();


const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);



const getRapidCCData = async (docType) => {
    let dataR = {
        Items: []
    };

    let Result = {
        Data: [],
        Summary: {}
    };

    try {
        let commandR = new ExecuteStatementCommand({
            Statement: `select DocType,MyTS,MyCount from RapidCCEvents`,
            ConsistentRead: true,
        });
        
        dataR = await docClient.send(commandR);
    } catch (e) {
        console.error ("Error getting EVENTS: " +e);
    }

    console.log("dataR: ", dataR);

    if (dataR.Items.length !==0 ) {
       // result.Data = dataR.Items;
        let total=0;
        let theItems =[];
        dataR.Items.forEach(item => {
            total += item.MyCount;
            let rptItem = {
                CityState: item.DocType,
                Date: item.MyTS,
                Count: item.MyCount
            }
            theItems.push(rptItem);
        });
        Result.Data = theItems;
        Result.Summary = {
            UniqueCityStateDate: dataR.Items.length,
            TotalRequests: total
        };
        return Result;
     }
     else {
        return Result;
     }

}

export const handler = async (event, context, call) => {

    let proEnv;
    let region="";
    let domain="";
   


    try {
        proEnv = event.stageVariables.proenvironment;
        region = event.stageVariables.proregion;
        domain = event.stageVariables.prodomain;
      
   

        let data = await getRapidCCData("ServiceEmail-IdTheftEnabled");

        return utils.httpRes(200, data);

    } catch (error) {
        console.error ("Caught error: " + error);
        return utils.httpRes(404,{
            "ServiceEmail": "failed",
            "error": error.message
        });
    }

   

}