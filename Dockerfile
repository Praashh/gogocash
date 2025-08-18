FROM node:20-alpine

WORKDIR /app
RUN apk add --no-cache python3 make g++ pkgconfig pixman-dev cairo-dev pango-dev libjpeg-turbo-dev giflib-dev openssl

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci 

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]