FROM node:lts-alpine

WORKDIR /home/app

COPY package.json /home/app/package.json

RUN npm i -g nodemon

RUN npm i

COPY . .

EXPOSE 1337

CMD ["npm", "start"]