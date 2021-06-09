FROM node:alpine
RUN apk add --no-cache nodejs npm

WORKDIR / app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

CMD [ "node", "server.js" ]

EXPOSE 8080

