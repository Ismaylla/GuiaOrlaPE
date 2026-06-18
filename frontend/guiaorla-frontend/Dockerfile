FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Recebe as URLs no momento do build
ARG NEXT_PUBLIC_API_URL
ARG API_URL_INTERNAL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV API_URL_INTERNAL=$API_URL_INTERNAL

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]