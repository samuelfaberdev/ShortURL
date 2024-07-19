FROM node:lts-alpine

RUN mkdir /app
WORKDIR /app

COPY ./*.json /app/
RUN npm i

COPY ./src /app/src
COPY ./public /app/public
COPY ./*.js /app/
COPY ./*.ts /app/

RUN npm run build

CMD npm start