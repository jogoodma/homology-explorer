FROM node:18.16 AS base
RUN echo "base stage..."

WORKDIR /app

RUN npm install -g pnpm

FROM base AS builder

RUN apt update
RUN apt -y install chromium
# Copy files
COPY apps/ui/ /app/apps/ui/
COPY packages/ /app/packages/
COPY *.yaml *.json .eslintrc.js /app/

RUN pnpm install --frozen-lockfile  && pnpm build
EXPOSE 4173
WORKDIR /app/apps/ui
CMD ["pnpm","run", "preview","--host"]
