#! /bin/sh

#echo "TOKEN: ${TOKEN}"
TOKEN=`echo ${TOKEN}`;

curl  -X PUT -H "Content-Type: application/json"  -d @./chgpass.json https://${APISERVER}/rapid/change/password/rapid.test \
  -H 'accept: application/json' \
  -H "Authorization: ${TOKEN}"

echo "\n\n"