FROM ubuntu:20.04 as builder

WORKDIR /app

RUN \
    set -eux; \
    apt-get update && \
    apt-get install -y curl build-essential python git && \
    curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs

# .editorconfig .stylelintrc .eslintignore .eslintrc.js
COPY package.json package-lock.json tsconfig.json webpack.config.ts .babelrc ./
RUN \
    set -eux; \
    npm ci

COPY src src
COPY public public

RUN \
    set -eux; \
    npm run build

FROM nginx:1.21

COPY --from=builder app/dist /usr/share/nginx/html
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf
