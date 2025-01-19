
FROM node:23-alpine

WORKDIR /usr/app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "start"]
