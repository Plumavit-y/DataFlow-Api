FROM node:20-alpine AS base

WORKDIR /app

FROM base AS deps

COPY package*.json ./
RUN npm ci --only=production

FROM base AS builder

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run lint && npm test

FROM base AS runner

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app package.json server.js src/ public/ .env.example

EXPOSE 3000

USER node

CMD ["node", "server.js"]