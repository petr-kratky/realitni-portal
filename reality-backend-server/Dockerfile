FROM node:12 AS builder

WORKDIR /opt/app-root/src

COPY src src
COPY swagger.config.json .
COPY tsconfig.json .
COPY package.json .

RUN npm install
RUN npm run build

FROM node:12

COPY --from=builder /opt/app-root/src/dist dist
COPY package.json .
RUN npm install --production

EXPOSE 3000/tcp

CMD npm run serve
