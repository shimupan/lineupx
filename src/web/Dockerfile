FROM node

WORKDIR /home/app

COPY package.json /home/app/package.json

RUN npm i

COPY ./src/web .

EXPOSE 5173

CMD ["npm", "run", "dev"]