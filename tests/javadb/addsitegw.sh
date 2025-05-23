#! /bin/sh

#TOKEN=`echo ${TOKEN}`;
#javadb.stg.reirapid.net

curl -X POST -H "Content-Type: application/json"  -d @./sitedata3.json https://javaapi.stg.reirapid.net/site/12 \
  -H 'accept: application/json' \
  -H "Authorization: ${TOKEN}"



echo "\n\n"
