FROM node:lts-alpine

WORKDIR /home/app

COPY package.json /home/app/package.json

RUN npm i -g nodemon

RUN npm i

COPY . .

RUN if [ ! -f /home/app/.env ]; then cp /home/app/.env.example /home/app/.env; fi

EXPOSE 1337

CMD ["npm", "start"]