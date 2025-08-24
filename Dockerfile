FROM node:23-alpine AS builder

RUN apk add --no-cache python3 make g++ pkgconfig pixman-dev cairo-dev pango-dev libjpeg-turbo-dev giflib-dev openssl

WORKDIR /app

ARG NODE_ENV=production

ENV NODE_ENV=$NODE_ENV

COPY package.json package-lock.json* ./
COPY prisma ./prisma

RUN npm ci --ignore-scripts --include=dev


RUN npx prisma generate

COPY . .

RUN npm run build

FROM node:23-alpine AS runner
WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "run", "start"]
