FROM pierrezemb/gostatic:latest

WORKDIR /srv/http
ADD ./bundle ./

EXPOSE 8043
CMD [ "/goStatic", "-fallback", "/index.html" ]
