FROM harbor.wiskind.cn/gy/nginx:1.23.2-alpine
COPY gmerp /usr/share/nginx/html
ENTRYPOINT ["nginx", "-g", "daemon off;"]