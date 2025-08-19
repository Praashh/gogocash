FROM node:23-alpine AS builder


RUN apk add --no-cache python3 make g++ pkgconfig pixman-dev cairo-dev pango-dev libjpeg-turbo-dev giflib-dev openssl


WORKDIR /app

COPY package.json ./
COPY prisma ./prisma

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:23-alpine AS runner

WORKDIR /app

COPY --from=builder /app ./


EXPOSE 3000

CMD ["npm", "run", "start"]