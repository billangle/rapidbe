#! /bin/sh

TOKEN=`echo ${TOKEN}`;

curl  -H "Content-Type: application/json" https://${APISERVER}/rapid/list/users \
  -H 'accept: application/json' \
  -H "Authorization: ${TOKEN}"

echo "\n\n"
