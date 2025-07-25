# Stage 1
FROM node:23.11.1-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN NODE_OPTIONS=--no-network-family-autoselection npm ci --legacy-peer-deps

COPY . .

RUN npm run build
# RUN npm run build

# Stage 2
FROM nginx:1.28.0-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder .gitlab-ci/envs/front_config /envs/front_config
COPY .nginx/config.conf /etc/nginx/conf.d/config.conf
EXPOSE 8082
