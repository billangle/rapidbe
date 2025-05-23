#! /bin/sh

#TOKEN=`echo ${TOKEN}`;
#javadb.stg.reirapid.net

curl -X GET -H "Content-Type: application/json"   https://${APISERVER}/properties/integration/site/12 \
  -H 'accept: application/json' 


echo "\n\n"
