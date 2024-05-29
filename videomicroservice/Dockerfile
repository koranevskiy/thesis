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

COPY . .
ENV NODE_ENV production
ENV TZ=Europe/Minsk

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs


USER nodejs
EXPOSE 8080
CMD ["node", "index.mjs"]