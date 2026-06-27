FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY apps/api/package*.json apps/api/
RUN npm install
COPY apps/api apps/api
WORKDIR /app/apps/api
RUN npx prisma generate && npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/package.json ./package.json
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/prisma ./prisma
EXPOSE 3333
