#! /bin/sh

echo "\n\n------------------------- TESTING HEALTH CHECK ----------------------\n\n"


#
curl -H "Content-Type: application/json" https://${APISERVER}/healthcheck \
     -H 'accept: application/json' 
echo "\n\n"