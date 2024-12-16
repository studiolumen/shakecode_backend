FROM node:18-alpine AS base

# INSTALL DEPENDENCIES FOR DEVELOPMENT (FOR NEST)
FROM base AS deps
WORKDIR /usr/src/app

COPY --chown=node:node package.json yarn.lock ./
RUN yarn --frozen-lockfile;

USER node

# INSTALL DEPENDENCIES & BUILD FOR PRODUCTION
FROM base AS build
WORKDIR /usr/src/app

COPY --chown=node:node --from=deps /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

RUN yarn build

ENV NODE_ENV production
RUN yarn --frozen-lockfile --production;
RUN rm -rf ./.next/cache

USER node

# PRODUCTION IMAGE
FROM base AS production
WORKDIR /usr/src/app

COPY --chown=node:node .env ./
COPY --chown=node:node package.json ./
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

RUN apt-get update
RUN apt-get install ca-certificates curl -y
RUN install -m 0755 -d /etc/apt/keyrings -y
RUN curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
RUN chmod a+r /etc/apt/keyrings/docker.asc

RUN echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null \
RUN apt-get update

RUN apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

CMD [ "node", "dist/main.js" ]