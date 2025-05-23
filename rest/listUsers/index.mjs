import { Utils } from "/opt/nodejs/Utils.mjs";
let utils = new Utils();


export const handler  = async (event, context, callback)  => {
    try {

        ///TODO use the TOKEN to return data for just the user in the TOKEN
       
        const userPoolId = await utils.getUserPool();
        const users = await utils.listPoolUsers();

        return utils.httpRes(200, {
            "users": users
        });


    } catch (error){

        console.log ("Caught error: " + error);
        return utils.httpRes(404,{
            "listUsers": "failed",
            "error": error.message
        });
    }

};












