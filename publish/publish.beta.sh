#!/bin/bash

PACK_DIR=package;

publish() {
    cd $PACK_DIR
    echo 'Publishing to npm...'
    npm publish *.tgz --tag beta
}

./pack.sh && publish