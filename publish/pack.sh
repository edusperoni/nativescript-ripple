#!/bin/bash

SOURCE_DIR=../src;
DIST_DIR=../dist/nativescript-ripple;
PACK_DIR=package;
PUBLISH_DIR="$PWD";

install(){
    npm i
}

pack() {

    echo 'Clearing dist /src and /package...'
    node_modules/.bin/rimraf "$DIST_DIR"
    node_modules/.bin/rimraf "$PACK_DIR"

    # compile package and copy files required by npm
    echo 'Building /src...'
    cd "$SOURCE_DIR"
    npm run build
    cd "$PUBLISH_DIR"

    echo 'Creating package...'
    # create package dir
    mkdir "$PACK_DIR"

    # create the package
    cd "$PACK_DIR"
    npm pack ../"$DIST_DIR"

}

install && pack