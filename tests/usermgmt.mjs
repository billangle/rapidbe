import axios from 'axios';

const APISERVER=process.env.APISERVER;
const username = '';
const password = "";


const rapidCCLogin = async() => {

    let token="";
    let url = `https://${APISERVER}/auth/internal/login/${username}/${password}`;
    try {

        let res = await axios.get(url,{});
        token = res.data.token;

    } catch (e) {
        console.error ("Error URL: " + url + " : " +e);
    }

   return token;
}

const rapidCCCreateUser = async(username) => {

    let res={};
    let url = `https://${APISERVER}/rapid/request/newuser`;

    const userData = {
        "username": username,
        "password": "",
        "email": "william.beckett+rapidtest@rapidright.net",
        "firstName": "William",
        "lastName": "Beckett",
        "street1": "1234 Main St",
        "city": "Fairfax",
        "state": "VA",
        "zip": "22033",
        "phone": "123-456-7890",
        "confirmEmail": "william.beckett+rapidtest@rapidright.net",
        "apt": "111D",
        "middlename": "Middle",
        "prefix": "Mr.",
        "suffix": "Jr.",
        "challengeQuestion": "What is your favorite color?",
        "challengeAnswer": "Blue" ,
        "role": "Admins"   }

    const user = {
        data: userData
    }

    try {

       res = await axios.put(url, user, {});

       
    } catch (e) {
        console.error ("Error URL: " + url + " : " +e );
    }

   return res.data;
}

const rapidCCListUsers= async(token) => {

    let res={};
    let url = `https://${APISERVER}/rapid/list/users`;
    try {

        res = await axios.get(url,{
            headers: {
                Authorization: `Bearer ${token}`,
                },
        });
       

    } catch (e) {
        console.error ("Error URL: " + url + " : " +e);
    }

   return res.data;
}

const rapidCCChangePassword= async(token,username) => {

    let res={};
    let url = `https://${APISERVER}/rapid/change/password/${username}`;
    let putData = {
        "newpassword": ""
    }
    try {

        res = await axios.put(url, putData,{
            headers: {
                Authorization: `Bearer ${token}`,
                },
        });
       

    } catch (e) {
        console.error ("Error URL: " + url + " : " +e);
    }

   return res.data;
}


const rapidCCDeleteUser= async(token, username) => {

    let res={};
    let url = `https://${APISERVER}/rapid/delete/user/${username}`;
    try {

        res = await axios.delete(url,{
            headers: {
                Authorization: `Bearer ${token}`,
                },
        });
       

    } catch (e) {
        console.error ("Error URL: " + url + " : " +e );
    }

   return res.data;
}

const run = async() => {

    const myToken = await rapidCCLogin();
    if (myToken === "") {
        console.error("Failed to login");
        return;
    }


    let res = await rapidCCListUsers(myToken);
    //console.log(JSON.stringify(res));
    let userCount = res.users.length;
    let expectedUsers = userCount +1;
    console.log(`Users: ${userCount}`);

    res = await rapidCCCreateUser("test.user");
    console.log(res);
    if (res !== undefined) {
        console.log("User created as expected");
    }
    else {
        console.error("User creation failed");
    }

    
    res = await rapidCCListUsers(myToken);
    userCount = res.users.length;
    if (userCount !== expectedUsers) {
        console.error(`User count mismatch ${userCount} != ${expectedUsers}`);
    }
    else {
        console.log(`Users: ${userCount}`);
    }


    res = await rapidCCCreateUser("test.user");
    if (res !== undefined) {
        console.error("This should have failed");
    }
    else {
        console.log("Duplicate user creation failed as expected");
    }

    res = await rapidCCChangePassword(myToken,"test.user");
    if (res !== undefined) {
        console.log("Password changed as expected");
    }
    else {
        console.error("Password change failed");
    }
    
    res = await rapidCCDeleteUser(myToken,"test.user");
    if (res !== undefined) {
        console.log("User deleted as expected");
    }
    else {
        console.error("User deletion failed");
    }

    expectedUsers = userCount -1;
    res = await rapidCCListUsers(myToken);
    userCount = res.users.length;
    if (userCount !== expectedUsers) {
        console.error(`User count mismatch ${userCount} != ${expectedUsers}`);
    }
    else {
        console.log(`Users: ${userCount}`);
    }

    res = await rapidCCDeleteUser(myToken,"test.user"); 
    if (res !== undefined) {
        console.error("This should have failed");
    }
    else {
        console.log("User deletion failed as expected");
    }
        
}

run();