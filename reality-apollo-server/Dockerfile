FROM registry.access.redhat.com/ubi8/nodejs-10 AS builder

WORKDIR /opt/app-root/src

COPY . .

RUN npm install
RUN npm run build

FROM registry.access.redhat.com/ubi8/nodejs-10

COPY --from=builder /opt/app-root/src/dist dist
COPY package.json .
RUN npm install --production

ENV HOST=0.0.0.0 PORT=4000

EXPOSE 4000/tcp

CMD npm run serve