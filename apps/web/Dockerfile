FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY apps/web/package*.json apps/web/
RUN npm install
COPY apps/web apps/web
WORKDIR /app/apps/web
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
