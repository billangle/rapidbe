#! /bin/sh

#echo "TOKEN: ${TOKEN}"
TOKEN=`echo ${TOKEN}`;

curl  -X PUT -H "Content-Type: application/json"  -d @./test1user-data.json https://${APISERVER}/rapid/request/newuser \
  -H 'accept: application/json' 

echo "\n\n"