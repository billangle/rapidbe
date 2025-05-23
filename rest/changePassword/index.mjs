import { Utils } from "/opt/nodejs/Utils.mjs";
let utils = new Utils();
/*
expecting 
 { 
    "newpassword": "password"
    
}

*/

export const handler  = async (event, context, callback)  => {
    try {

        let username =  decodeURIComponent(event.pathParameters.username);
      //  let newpassword = decodeURIComponent(event.pathParameters.newpassword);
       
        const userPoolId = await utils.getUserPool();
        console.log('user: ', username);
        let testUser = await utils.getEmailForUserName(username);
        if (testUser !== "") { 
            let data = JSON.parse(event.body);
            console.log('data: ', data);
            let user = {
                "username": username,
                "password": data.newpassword
            };
            let res = await utils.setPassword(user);
        }
        else {
            return  utils.httpRes (400,{"error": "username does not exist"});
        }

        
        return utils.httpRes(200, {
            "changePassword": "user "+ username + " password changed"
        });


    } catch (error){

        console.log ("Caught error: " + error);
        return utils.httpRes(404,{
            "changePassword": "failed",
            "error": error.message
        });
    }

};

