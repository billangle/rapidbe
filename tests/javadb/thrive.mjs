import axios from 'axios';

const ECSSERVER=process.env.ECSSERVER;
const APISERVER=process.env.APISERVER;
const username = 'rapid.test1';
const password = "Passw0rd123qwery!";


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

const rapidCCAddSite = async(siteId, port, token) => {

    let res={};
    let url = `https://${ECSSERVER}/site/${siteId}`;

    const siteData = {
        "host": ECSSERVER,
        "port": port,
        "enabled": true
  }


    try {

       res = await axios.post(url, siteData, {
        headers: {
            Authorization: `Bearer ${token}`,
            },
       });

       
    } catch (e) {
        console.error ("Error URL: " + url + " : " +e );
    }

   return res.data;
}

const rapidCCGetSite= async(token, siteId) => {

    let res={};
    let url = `https://${ECSSERVER}/site/${siteId}`;
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




const rapidCCDeleteSite= async(token, siteId, indexId) => {

    let res={};
    let url = `https://${ECSSERVER}/site/${siteId}/index/${indexId}`;
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

   let siteId1 = 10;
   let siteId2 = 11;
   let res;
   /*
    let res = await rapidCCListUsers(myToken);
    //console.log(JSON.stringify(res));
    let userCount = res.users.length;
    let expectedUsers = userCount +1;
    console.log(`Users: ${userCount}`);*/

    res = await rapidCCAddSite(siteId1, 8080, myToken);
    console.log(res);
    if (res !== undefined) {
        console.log("Site created as expected");
    }
    else {
        console.error("Site creation failed");
    }

    res = await rapidCCAddSite(siteId1, 8000, myToken);
    console.log(res);
    if (res !== undefined) {
        console.log("Site created as expected");
    }
    else {
        console.error("Site creation failed");
    }

    res = await rapidCCAddSite(siteId2, 8080, myToken);
    console.log(res);
    if (res !== undefined) {
        console.log("Site created as expected");
    }
    else {
        console.error("Site creation failed");
    }

    res = await rapidCCAddSite(siteId2, 8000, myToken);
    console.log(res);
    if (res !== undefined) {
        console.log("Site created as expected");
    }
    else {
        console.error("Site creation failed");
    }

    
    res = await rapidCCGetSite(myToken, siteId1);
    console.log(res);

    res = await rapidCCGetSite(myToken, siteId2);
    console.log(res);

    /*
    userCount = res.users.length;
    if (userCount !== expectedUsers) {
        console.error(`User count mismatch ${userCount} != ${expectedUsers}`);
    }
    else {
        console.log(`Users: ${userCount}`);
    }
        */


/*
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
    }*/
        
}

run();