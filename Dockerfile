# base node image
FROM node:16-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl curl

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /myapp

ADD package.json ./
ADD package-lock.jso[n] yarn.loc[k] pnpm-lock.yam[l] pnpm-lock.ym[l] .pnpmfile.cj[s] ./
# the following script will install the dependencies with which ever lock file is available
ADD scripts/install-deps.sh ./install-deps.sh
RUN ./install-deps.sh

# Setup production node_modules
FROM base as production-deps

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules
ADD package.json ./
ADD package-lock.jso[n] yarn.loc[k] pnpm-lock.yam[l] pnpm-lock.ym[l] .pnpmfile.cj[s] ./
# the following script will install the dependencies with which ever lock file is available
ADD scripts/install-deps.sh ./install-deps.sh
RUN ./install-deps.sh --prune

# Build the app
FROM base as build

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules

ADD prisma .
RUN npx prisma generate

ADD . .
RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /myapp

COPY --from=production-deps /myapp/node_modules /myapp/node_modules
COPY --from=build /myapp/node_modules/.prisma /myapp/node_modules/.prisma

COPY --from=build /myapp/build /myapp/build
COPY --from=build /myapp/public /myapp/public
ADD . .

CMD ["npm", "start"]
