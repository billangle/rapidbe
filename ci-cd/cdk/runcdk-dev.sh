#! /bin/sh

export DEPLOY_ENV=stg
export ADMINUSER=cdkuser-DEV
cdk deploy --require-approval never --profile cdkuser-DEV
RETURN=$?

if [ $RETURN -eq 0 ];
then
  echo "CDK was successful"
 # node deployment.js
else
  echo "CDK contained errors $RETURN"
  exit $RETURN
fi 