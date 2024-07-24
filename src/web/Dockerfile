FROM node:lts-alpine

WORKDIR /home/web

COPY package.json /home/web/package.json
COPY package-lock.json /home/web/package-lock.json

RUN npm i

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev-exposed"]
