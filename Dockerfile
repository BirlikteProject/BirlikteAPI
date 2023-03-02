FROM node:16-alpine

WORKDIR /usr/src/app

USER root

RUN apk update && apk upgrade
RUN apk add git

RUN apk add supervisor

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

COPY package*.json ./
COPY . .

RUN npm install

EXPOSE 8080
EXPOSE 3200

CMD ["/usr/bin/supervisord"]