#! /bin/sh

TOKEN=`echo ${TOKEN}`;
echo "https://${APISERVER}/rapid/report/data/${1}"

curl  -H "Content-Type: application/json" https://${APISERVER}/rapid/report/data/${1} \
  -H 'accept: application/json' \
  -H "Authorization: ${TOKEN}"

echo "\n\n"
