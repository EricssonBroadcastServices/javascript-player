#!/bin/bash

# SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
#
# SPDX-License-Identifier: MIT

rm -rf npm
mkdir npm
cp -r {package.json,readme.md,dist,dist/style.css} npm
cd npm
npm pkg delete scripts publishConfig devDependencies
npm pkg set main=dist/rbm-player-component.min.js
../../../scripts/publish.sh @redbeemedia/javascript-player-web-component
