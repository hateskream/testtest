# Stage 1
FROM node:22.13.0-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN NODE_OPTIONS=--no-network-family-autoselection npm ci --legacy-peer-deps

COPY . .

RUN npm run build

# Stage 2
# FROM nginx:1.27.3-alpine
# COPY --from=builder /app/dist /usr/share/nginx/html
# COPY .nginx/config.conf /etc/nginx/conf.d/config.conf
# EXPOSE 8082