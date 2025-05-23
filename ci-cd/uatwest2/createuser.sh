# /bin/sh


POOLID=${1}
USERNAME=${2}
EMAIL=${3}
PASSWORD=${4}
GROUP=${5}

aws --profile ${ADMINUSER} cognito-idp admin-create-user \
  --user-pool-id ${POOLID} \
  --username "${USERNAME}"  \
  --message-action "SUPPRESS" \
  --user-attributes Name="email",Value="${EMAIL}" \
     Name="name",Value="${USERNAME}" \
     Name="email_verified",Value="true" \
     Name="custom:confirmEmail",Value="${EMAIL}" 



aws --profile ${ADMINUSER} cognito-idp admin-set-user-password \
  --user-pool-id ${POOLID} --username "${USERNAME}" \
 --password "${PASSWORD}"  \
 --permanent

 aws --profile ${ADMINUSER} cognito-idp admin-add-user-to-group \
  --user-pool-id ${POOLID} --username "${USERNAME}" \
 --group-name "${GROUP}"  
