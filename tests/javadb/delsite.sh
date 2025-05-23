#! /bin/sh

#TOKEN=`echo ${TOKEN}`;
#javadb.stg.reirapid.net

curl -X DELETE -H "Content-Type: application/json"   https://${APISERVER}/properties/integration/site/12/index/1 \
  -H 'accept: application/json' 


echo "\n\n"
