FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
# RUN rm -rf node_modules/ && npm update

COPY . .

RUN npm run build

CMD ["npm", "run", "start:dev"]
