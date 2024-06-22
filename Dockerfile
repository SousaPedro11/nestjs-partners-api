FROM node:alpine

RUN apk update && apk add openssl procps && rm -rf /var/cache/apk/*

RUN npm install -g @nestjs/cli

ENV DOCKERIZE_VERSION "v0.6.1"
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /home/node/app

COPY package.json yarn.lock ./

RUN yarn install

USER node

CMD ["tail", "-f", "/dev/null"]