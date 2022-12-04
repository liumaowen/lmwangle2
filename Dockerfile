FROM harbor.wiskind.cn/gy/node:8.17.0-alpine as build
WORKDIR /gmerp
COPY . /gmerp
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/system/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezoness
RUN set -x && \
    #npm config set registry http://verdaccio.wiskind.cn/ && \
    npm config set registry http://192.168.7.171/ && \
    npm config set sass_binary_site https://cdn.npmmirror.com/binaries/node-sass && \
    npm i --loglevel verbose && \
    #npm i && \
    cp -r base.js/. node_modules/ && \
    npm run builddev

FROM harbor.wiskind.cn/gy/nginx:1.23.2-alpine
COPY --from=build /gmerp/gmerp /usr/share/nginx/html
ENTRYPOINT ["nginx", "-g", "daemon off;"]