#!/bin/bash

PRUNE=false

while [ $# -gt 0 ] ; do
  case $1 in
    -p | --prune) PRUNE=true ;;
  esac
  shift
done


if [ -f "yarn.lock" ]; then
  echo "Installing dependencies from yarn.lock"
  if [ "$PRUNE" = true ]; then
    # https://github.com/yarnpkg/yarn/issues/696#issuecomment-258418656
    yarn install --production --ignore-scripts --prefer-offline
  else
    yarn install --production=false
  fi
elif [ -f "pnpm-lock.yaml" ] || [ -f "pnpm-lock.yaml" ]; then
  echo "Installing dependencies from pnpm-lock.yaml"
  curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm
  if [ "$PRUNE" = true ]; then
    pnpm prune
  else
    pnpm install --production=false
  fi
else
  echo "Installing dependencies from package-lock.json"
  if [ "$PRUNE" = true ]; then
    npm prune --production
  else
    npm install --production=false
  fi
fi
