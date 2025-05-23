#! /bin/sh

# export APISERVER=oktaqa.reirapid.net
# jane.doetest@reirapid.net
# john.smithtest@reirapid.net
# test.user@reirapid.net
# users are created via https://trial-2921931.okta.com





curl  -H "Content-Type: application/json" https://${APISERVER}/oktaqa/onlycode/${1} \
  -H 'accept: application/json' 

echo "\n\n"
