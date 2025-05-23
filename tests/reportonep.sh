#! /bin/sh

TOKEN=`echo ${TOKEN}`;
echo "https://${APISERVER}/rapid/report/data/Fort%20Jeremieside-WY"

curl  -H "Content-Type: application/json" https://${APISERVER}/rapid/report/data/Fort%20Jeremieside-WY \
  -H 'accept: application/json' \
  -H "Authorization: ${TOKEN}"

echo "\n\n"
