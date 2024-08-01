FROM node:lts-alpine

WORKDIR /home/web

COPY package.json /home/web/package.json
COPY package-lock.json /home/web/package-lock.json

RUN npm i

COPY . .

RUN if [ ! -f /home/web/.env ]; then cp /home/web/.env.example /home/web/.env; fi

EXPOSE 5173

CMD ["npm", "run", "dev-exposed"]
