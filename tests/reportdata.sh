#! /bin/sh

TOKEN=`echo ${TOKEN}`;
echo "https://${APISERVER}/rapid/report/data"

curl  -H "Content-Type: application/json" https://${APISERVER}/rapid/report/data \
  -H 'accept: application/json' \
  -H "Authorization: ${TOKEN}"

echo "\n\n"
