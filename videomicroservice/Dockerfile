# syntax=docker/dockerfile:1
FROM node:lts-alpine AS build
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi
RUN apk add -U tzdata
RUN apk update && apk add && apk add ffmpeg

COPY . .
ENV NODE_ENV production
ENV TZ=Europe/Minsk
RUN cp /usr/share/zoneinfo/Europe/Minsk /etc/localtime



EXPOSE 8080
CMD ["node", "index.mjs"]