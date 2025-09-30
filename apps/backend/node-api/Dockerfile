# demo-mode: container build for Node API
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY apps/backend/node-api/package.json apps/backend/node-api/
RUN corepack enable && pnpm install --filter node-api...

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
WORKDIR /app/apps/backend/node-api
RUN corepack enable && pnpm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/backend/node-api/dist ./dist
COPY --from=deps /app/apps/backend/node-api/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules
COPY apps/backend/node-api/prisma ./prisma
EXPOSE 9101
CMD ["node", "dist/server.js"]
