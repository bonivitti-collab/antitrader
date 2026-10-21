FROM node:24-bookworm-slim

WORKDIR /app
RUN npm install --global bun@1.4.3
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY server.ts tsconfig.json vite.config.ts index.html ./
COPY src ./src
COPY public ./public
RUN bun run build

ENV NODE_ENV=production
ENV PORT=3000
USER node
EXPOSE 3000
CMD ["npm", "start"]
