# --- ARGS ---

ARG HOME=/home/node
ARG APP=app
ARG USER=node
ARG NODE_VERSION=10

# --- BUILDER STAGE ---

FROM node:$NODE_VERSION AS builder

ARG HOME
ARG APP
ARG USER

USER $USER

ENV NPM_CONFIG_PREFIX=$HOME/.npm-global
ENV PATH=$PATH:$HOME/.npm-global/bin

WORKDIR $HOME/$APP

COPY package*.json .

RUN npm install

COPY --chown=$USER:$USER . .

RUN npm run build

# --- RUNNER STAGE ---

FROM node:$NODE_VERSION as runner

ARG HOME
ARG APP
ARG USER

USER $USER

ENV NPM_CONFIG_PREFIX=$HOME/.npm-global
ENV PATH=$PATH:$HOME/.npm-global/bin

WORKDIR $HOME/$APP

COPY package*.json .

RUN npm install --production

COPY --from=builder --chown=$USER:$USER $HOME/$APP/dist dist
COPY --from=builder --chown=$USER:$USER $HOME/$APP/.next .next

ENV HOST=0.0.0.0 PORT=3000

EXPOSE 3000/tcp

CMD ["npm", "run", "start"]
