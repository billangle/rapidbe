import { Utils } from "/opt/nodejs/Utils.mjs";
let utils = new Utils();


export const handler  = async (event, context, callback)  => {
    try {

        let username =  decodeURIComponent(event.pathParameters.username);
       
        const userPoolId = await utils.getUserPool();
        const del = await utils.deleteUser(username);
        
        return utils.httpRes(200, {
            "deleteUser": "user "+ username + " deleted"
        });


    } catch (error){

        console.log ("Caught error: " + error);
        return utils.httpRes(404,{
            "deleteUsers": "failed",
            "error": error.message
        });
    }

};

