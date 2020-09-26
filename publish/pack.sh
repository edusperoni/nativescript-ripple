#!/bin/bash

SOURCE_DIR=../src;
TO_SOURCE_DIR=src;
TO_DIST_DIR=dist/nativescript-ripple;
PACK_DIR=package;
ROOT_DIR=..;
PUBLISH=--publish

install(){
    npm i
}

pack() {

    echo 'Clearing dist /src and /package...'
    node_modules/.bin/rimraf "$TO_DIST_DIR"
    node_modules/.bin/rimraf "$TO_SOURCE_DIR"
    node_modules/.bin/rimraf "$PACK_DIR"

    # copy src
    echo 'Copying src...'
    node_modules/.bin/ncp "$SOURCE_DIR" "$TO_SOURCE_DIR"

    # compile package and copy files required by npm
    echo 'Building /src...'
    cd "$TO_SOURCE_DIR"
    npm run build
    cd ..

    echo 'Creating package...'
    # create package dir
    mkdir "$PACK_DIR"

    # create the package
    cd "$PACK_DIR"
    npm pack ../"$TO_DIST_DIR"

    # delete source directory used to create the package
    cd ..
    node_modules/.bin/rimraf "$TO_SOURCE_DIR"
}

install && pack