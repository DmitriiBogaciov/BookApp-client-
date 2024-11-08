# syntax=docker/dockerfile:1

ARG NODE_VERSION=19.5.0

FROM node:${NODE_VERSION}-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

RUN npm install -g nodemon

COPY . .

EXPOSE 3000

CMD npm run dev:watch