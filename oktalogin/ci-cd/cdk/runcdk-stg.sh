#! /bin/sh

export DEPLOY_ENV=qa
export ADMINUSER=cdkuser-QA
cdk deploy --require-approval never --profile cdkuser-QA
RETURN=$?

if [ $RETURN -eq 0 ];
then
  echo "CDK was successful"
#  node deployment.js
else
  echo "CDK contained errors $RETURN"
  exit $RETURN
fi 