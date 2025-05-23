#! /bin/sh

#TOKEN=`echo ${TOKEN}`;
#javadb.stg.reirapid.net

curl -X POST -H "Content-Type: application/json"  -d @./sitedata2.json https://${APISERVER}/properties/integration/site/12 \
  -H 'accept: application/json' 


echo "\n\n"
