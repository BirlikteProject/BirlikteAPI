FROM node:16-alpine

WORKDIR /usr/src/app

RUN apk update && apk upgrade
RUN apk add git

COPY package*.json ./
COPY . .

RUN npm install

EXPOSE 8080
CMD [ "npm", "start" ]
