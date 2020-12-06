FROM registry.access.redhat.com/ubi8/nodejs-12

WORKDIR /opt/app-root/src

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

ENV HOST=0.0.0.0 PORT=3000

EXPOSE 3000/tcp

CMD npm run start
