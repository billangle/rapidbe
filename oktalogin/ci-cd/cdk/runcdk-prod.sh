#! /bin/sh

export DEPLOY_ENV=prod
cdk deploy --require-approval never 
RETURN=$?

if [ $RETURN -eq 0 ];
then
  echo "CDK was successful"
 # node deployment.js
else
  echo "CDK contained errors $RETURN"
  exit $RETURN
fi 