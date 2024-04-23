#!/bin/bash

# SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
#
# SPDX-License-Identifier: MIT

# npm publish requires a tag or naively forces it to be latest
# https://github.com/npm/npm/issues/6778
function ver { printf "%03d%03d%03d%03d" $(echo "$1" | tr '.' ' '); }

PKGNAME="$1"

if [ -z "$PKGNAME" ]; then
  echo "Release script requires an argument for the package name (ex @redbeemedia/javascript-player)"
  exit 1
fi

VERSION=$(npm pkg get version --no-workspaces | tr -d \") # local package.json version
LATEST=$(npm view $PKGNAME version --no-workspaces) # this checks the currently published "latest" version

if [[ $VERSION == *-* ]]; then
  TAG="experimental" # unstable release
elif [ $(ver $VERSION) -lt $(ver $LATEST) ]; then
  TAG="maintenance" # version number older than latest, but released after, must be tagged with something other than latest
else
  TAG="latest"
fi

npm pkg set name=$PKGNAME
npm publish --access=public --tag=$TAG
