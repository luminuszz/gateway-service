FROM node:18-alpine3.16

WORKDIR /home/services/gateway-service

COPY package.json .

COPY yarn.lock .

RUN yarn global add pm2

RUN yarn install

COPY . ./

RUN yarn build

VOLUME ["/home/services/gateway-service/dist"]

CMD ["pm2-runtime", "./dist/src/main.js"]