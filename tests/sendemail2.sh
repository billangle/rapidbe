#! /bin/sh

TOKEN=`echo ${TOKEN}`;

curl -X PUT -H "Content-Type: application/json"  -d @./email-data.json https://${APISERVER}/rapid/send/message \
  -H 'accept: application/json' \
  -H "Authorization: ${TOKEN}"

echo "\n\n"
