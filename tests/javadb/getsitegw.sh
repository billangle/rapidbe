#! /bin/sh

#TOKEN=`echo ${TOKEN}`;
#javadb.stg.reirapid.net

curl -X GET -H "Content-Type: application/json"   https://javaapi.stg.reirapid.net/site/12 \
  -H 'accept: application/json' \
  -H "Authorization: ${TOKEN}"


echo "\n\n"
