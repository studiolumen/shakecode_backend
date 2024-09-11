#!/bin/bash

PRIVATE_KEY_FILE="/tmp/jwt.key"
PUBLIC_KEY_FILE="/tmp/jwt.key.pub"

function print() {
    awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}'
}

echo "Generating RSA private key, 4096 bit long modulus"
ssh-keygen -t rsa -b 4096 -m PEM -f $PRIVATE_KEY_FILE -q -N "" > /dev/null 2>&1
openssl rsa -in $PRIVATE_KEY_FILE -pubout -outform PEM -out $PUBLIC_KEY_FILE > /dev/null 2>&1
printf "\n\n"

echo "Private key:"
print < $PRIVATE_KEY_FILE
printf "\n\n"

echo "Public key:"
print < $PUBLIC_KEY_FILE
printf "\n\n"

rm -f $PRIVATE_KEY_FILE
rm -f $PUBLIC_KEY_FILE

echo "Done"