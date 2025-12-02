FROM oven/bun:1
WORKDIR /app
COPY package.json bun.lock tsconfig.json ./
RUN bun install --frozen-lockfile
COPY src ./src
EXPOSE 8080
CMD ["bun", "run", "src/app.ts"]
