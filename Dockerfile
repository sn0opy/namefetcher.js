FROM node:14-alpine
WORKDIR /app
COPY . .
RUN npm install
ENTRYPOINT /app/docker-entrypoint.sh
