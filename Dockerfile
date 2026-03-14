# stage build
FROM oven/bun:1 AS build

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build


# stage run
FROM node:24-slim

WORKDIR /app

COPY --from=build /app/build ./
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "./index.js"]
