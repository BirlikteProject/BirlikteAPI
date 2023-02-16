FROM node:16-alpine

WORKDIR /usr/src/app

RUN apk update && apk upgrade
RUN apk add git

COPY package*.json ./
COPY . .

RUN npm install

EXPOSE 8080

RUN echo "api.birlikte.org.tr 20.105.232.5" >> /etc/hosts
RUN echo "socket.birlikte.org.tr 20.105.232.5" >> /etc/hosts

CMD [ "npm", "start" ]
