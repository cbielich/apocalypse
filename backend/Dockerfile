FROM node:22-slim

WORKDIR /app

# Build tooling for native modules (better-sqlite3).
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

ENV DATA_DIR=/data
EXPOSE 4000
VOLUME ["/data"]

CMD ["npm", "start"]
