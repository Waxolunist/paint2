FROM pierrezemb/gostatic:latest

WORKDIR /srv/http
ADD ./bundle ./

EXPOSE 8043
CMD ["-enable-health", "-enable-logging", "-fallback", "/index.html" ]
