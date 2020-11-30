FROM fholzer/nginx-brotli:v1.19.1

COPY ./bundle /usr/share/nginx/html
COPY ./nginx/*.conf /etc/nginx/conf.d/
RUN rm -f /etc/nginx/conf.d/default.conf
