#! /bin/sh

#
curl -X DELETE -H "Content-Type: application/json" https://${APISERVER}/rapid/delete/user/bbeckett \
  -H 'accept: application/json' \
  -H "Authorization: ${TOKEN}"

  
echo "\n\n"