FROM registry.access.redhat.com/ubi8/nodejs-10

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3300

CMD npm start