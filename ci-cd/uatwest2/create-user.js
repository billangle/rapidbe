const fs = require('fs');
const { exec, execSync} = require("child_process");


let configData;
let functionData;
let baseDir="../";
let environment=process.env.DEPLOY_ENV;


try {
  const envdata = fs.readFileSync(baseDir + environment+ '/rapid-users.json', 'utf8');
  configData = JSON.parse(envdata);
  
  console.log ("Creating Users for ENVIRONENT: " + environment + " ADMINUSER: " + process.env.ADMINUSER );
  const pool = configData.settings.user_pool;
  const password = configData.settings.password;
  const baseEmail = configData.settings.base_email;
  configData.users.forEach (f => {
      
         let email = `${f.email}`;
         createUser(pool,f.username,email,password,f.group);
     })

} catch (err) {
  console.error(err);
}



function createUser (pool,username,email,password,group) 
{
        
        let command = "./createuser.sh " + pool+ " " + username + " " + email + " " + password + " " + group;
        execSync(
            command,
            {stdio: 'ignore',stderr: 'ignore'}
          );
}
