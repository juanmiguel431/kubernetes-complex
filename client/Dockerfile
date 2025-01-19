
FROM node:23-alpine AS builder
WORKDIR /usr/app
COPY package*.json .
RUN npm install
COPY . .
RUN ppm run build

FROM nginx:1.27.3-alpine
ENV NGINX_PORT=3000
EXPOSE $NGINX_PORT
COPY --from=builder /usr/app/dist /usr/share/nginx/html
COPY ./nginx/default-prod.conf /etc/nginx/conf.d/default.conf
