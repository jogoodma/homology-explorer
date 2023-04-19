FROM node:16-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN npm install -g pnpm && \
    pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm run dev"]
