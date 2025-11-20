FROM nginx:1.29.3-alpine

COPY dist /usr/share/nginx/html

COPY .nginx/config.conf /etc/nginx/conf.d/config.conf
EXPOSE 8082
