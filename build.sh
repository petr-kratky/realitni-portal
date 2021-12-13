#!bin/bash

# -x flag traces each command
# -e flag makes program exit on error without further executing other commands
set -ex

# extract -p and -t flags
while getopts p: flag
do
    case "${flag}" in 
        p) PROJECT_PATH=${OPTARG};;
    esac
done

# GRAPHQL SERVER
docker build \
    -t rp-graphql $PROJECT_PATH/reality-apollo-server

aws lightsail push-container-image \
    --service-name reality-portal \
    --label graphql \
    --image rp-graphql

# FRONTEND SERVER
docker build \
    -t rp-frontend $PROJECT_PATH/reality-frontend

aws lightsail push-container-image \
    --service-name reality-portal \
    --label frontend \
    --image rp-frontend

# list local built images
docker images | grep "rp-"
