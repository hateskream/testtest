FROM node:22.13.0-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN NODE_OPTIONS=--no-network-family-autoselection npm ci --legacy-peer-deps

COPY . .

RUN npm run build
