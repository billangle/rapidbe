#! /bin/sh

#TOKEN=`echo ${TOKEN}`;
#javadb.stg.reirapid.net

curl -X POST -H "Content-Type: application/json"  -d @./site-data.json http://k8s-k8salb-fcc65732d6-114117196.us-east-2.elb.amazonaws.com/properties/integration/site/12 \
  -H 'accept: application/json' 


echo "\n\n"
