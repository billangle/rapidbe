import { Utils } from "/opt/nodejs/Utils.mjs";
let utils = new Utils();


// payload {
//     prefix: string;
//     firstName: string;
//     lastName: string;
//     suffix: string;
//     street1: string;
//     apt: string;
//     city: string;
//     state: string;
//     zip: string;
//     email: string;
//     confirmEmail: string;
//     phone: string;
//     phone2: string;
//     username: string;
//     password: string;
//     confirmPassword: string;
//     middleName: string;
//     street2: stringg
//     lastSavedDate: string;

// }
export const handler  = async (event, context, callback)  => {
    try {

       
        const userPoolId = await utils.getUserPool();
        console.log('userPoolId: ', userPoolId);
    

       let user = JSON.parse(event.body);
        //let user = event.body;
        console.log('user: ', user);
        let testUser = await utils.getEmailForUserName(user.data.username);
        console.log('testUser: ', testUser);
        if (testUser !== "") {
             return  utils.httpRes (400,{"error": "username already exists"});
        }
    
        let response = await registerNewUser(user.data);
        return response;

    } catch (error){

        console.log ("Caught error: " + error);
        return utils.httpRes(404,{
            "postUsers": "failed",
            "error": error.message
        });
    }

};




async function registerNewUser(user) {
    const name = `${user.firstName} ${user.lastName}`;
    console.log('registerNewUser: ', name);
    try {
        if ( /^[\p{L}\p{M}\p{N}\p{P}]+$/gu.test(user.username) ) {
            /** If username is legitimate, attempt to insert the record. */
   
            const createCognitoUserResponse = await utils.createCognitoUser(user);
            const setPasswordResponse = await  utils.setPassword(user);

            let userType ="Users"

            try { 
                if (user.role == "Admins") {
                    userType = "Admins";
                }
            } catch (e) {
                console.log("Role not defined. Defaulting to Users");
            }

            const setGroupResponse = await utils.setGroups(user,userType);

           // const sendEmailResponse = await sendRegistrationEmail(name,user.username, user.email,user.role,resources);

            return utils.httpRes(200,{
                "msg" : "New User " + user.username + " Registered"
            });

        
        } else {
            console.log(JSON.stringify(user));
            return utils.httpRes(400,{"error": "Username " + user.username + " contains forbidden characters."});
        }
            

    } catch (e) {
        console.error("User Registration failure.");
        console.log(JSON.stringify(user));
        return utils.httpRes(400,{"error": "User registration failed for " + user.username + " " + e.message});
    }
}



//@todo update NP-1263
async function sendRegistrationEmail(name,username,email,role,resources) {
    console.log('sendRegistrationEmail');
    let emailTemplate = role == 'Admins' ? "UserAdminRegistration" : role=="Research-Institute" ? "UserResearchInstituteRegistration" :"UserRegistration";


    const emailResponse = await resources.es.send([email],emailTemplate,{
        username:username,
        name:name,
        email:email,
        prosams:resources.appURL
    });
    console.log(JSON.stringify(emailResponse));
    return emailResponse;
}








