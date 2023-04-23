FROM node:18
WORKDIR /code
COPY pnpm-lock.yaml package.json /code/
RUN npm install -g pnpm && \
    pnpm install

COPY . /code/
EXPOSE 5173
CMD ["pnpm", "run", "dev"]
