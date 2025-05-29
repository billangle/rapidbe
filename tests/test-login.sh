#! /bin/sh

echo "\n\n------------------------- TESTING LOGIN  ----------------------\n\n"


#
curl -H "Content-Type: application/json" https://${APISERVER}/auth/internal/login/rapid.test1/ \
  -H 'accept: application/json' 
echo "\n\n"