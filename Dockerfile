# base node image
FROM node:16-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /myapp

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

ADD package.json pnpm-lock.yaml ./
RUN pnpm fetch

RUN pnpm install -r --offline --prod=false

# Setup production node_modules
FROM base as production-deps

WORKDIR /myapp

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

ADD package.json pnpm-lock.yaml ./
RUN pnpm fetch

COPY --from=deps /myapp/node_modules /myapp/node_modules
ADD package.json pnpm-lock.yaml ./

RUN pnpm prune --prod

# Build the app
FROM base as build

WORKDIR /myapp

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

ADD package.json pnpm-lock.yaml ./
RUN pnpm fetch

COPY --from=deps /myapp/node_modules /myapp/node_modules

ADD prisma .
RUN pnpm exec prisma generate

RUN pnpm fetch

ADD . .
RUN pnpm run build

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /myapp

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

ADD package.json pnpm-lock.yaml ./
RUN pnpm fetch

COPY --from=production-deps /myapp/node_modules /myapp/node_modules
COPY --from=build /myapp/node_modules/.prisma /myapp/node_modules/.prisma

COPY --from=build /myapp/build /myapp/build
COPY --from=build /myapp/public /myapp/public
ADD . .

CMD ["pnpm", "start"]
