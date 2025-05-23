#! /bin/sh

export DEPLOY_ENV=uat
export ADMINUSER=cdkuser-UAT
cdk deploy --require-approval never --profile cdkuser-UAT
RETURN=$?

if [ $RETURN -eq 0 ];
then
  echo "CDK was successful"
#  node deployment.js
else
  echo "CDK contained errors $RETURN"
  exit $RETURN
fi 
