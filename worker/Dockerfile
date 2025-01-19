
FROM node:23-alpine

WORKDIR /usr/app

COPY package*.json .

RUN npm install

COPY . .

CMD ["npm", "run", "start"]
