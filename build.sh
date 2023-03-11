#!/bin/bash
set -x

export DOCKER_IMAGE_TAG=$(($(date '+%s%N') / 1000000))

if [ $1 = 'test' ]; then
    # export DEPLOYMENT_IMAGE="harbor.wiskind.cn/tdtest/gmerp/gmerp-frontend:$DOCKER_IMAGE_TAG"
    export DEPLOYMENT_IMAGE="registry.cn-hangzhou.aliyuncs.com/wiskind/gmerp-frontend-test:$DOCKER_IMAGE_TAG"
    docker login registry.cn-hangzhou.aliyuncs.com -u wiskindjt -p Wisdom123
    docker build --no-cache -f Dockerfile-test -t $DEPLOYMENT_IMAGE .
elif [ $1 = 'prod' ]; then
    docker logout harbor.wiskind.cn
    docker login harbor.wiskind.cn -u td -p Wsd@1234
    export DEPLOYMENT_IMAGE="harbor.wiskind.cn/td/gmerp/gmerp-frontend:$DOCKER_IMAGE_TAG"
    docker build --no-cache -f Dockerfile-gm -t $DEPLOYMENT_IMAGE .
else
    echo 入参错误!
    exit 1
fi

docker push $DEPLOYMENT_IMAGE
docker logout harbor.wiskind.cn
docker logout registry.cn-hangzhou.aliyuncs.com

set +x
echo image has been pushed as : $DEPLOYMENT_IMAGE
