<!--
SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>

SPDX-License-Identifier: CC-BY-SA-4.0
-->

# Red Bee JavaScript Player SDKs

[![REUSE status](https://api.reuse.software/badge/github.com/EricssonBroadcastServices/javascript-player)](https://api.reuse.software/info/github.com/EricssonBroadcastServices/javascript-player)

Public Documentation

- JavaScript SDK: https://redbee.live/docs/Client%20SDKs/Web/Player/Documentation/
- Web Component: https://redbee.live/docs/Client%20SDKs/Web/WebComponent/

## Demo

[A demo of the player can be found here](https://ericssonbroadcastservices.github.io/javascript-player/).
The demo runs on a GitHub page that is deployed on push to master.

## Development

Make sure you read [Working with git](https://github.com/EricssonBroadcastServices/team-players/blob/master/git.md) before getting started.

You need to configure npm to have access to github packages, see [here](https://docs.github.com/en/packages/guides/configuring-npm-for-use-with-github-packages#authenticating-with-a-personal-access-token)

Before anything else run `npm install`, if you are using Windows, use Git Bash.

Development scripts

* `npm run dev` - bundle packages and start player demo at port 1234
* `npm run dev:web-component` - bundle packages and start web-component player demo at port 1234

### Using local builds in other projects

1. `npm run build` - this will build all packages and update all package.json files so that the they point to the build output instead of the source ( DON'T COMMIT THESE CHANGES ) 
2. Go to the project in question, this project should already depend on the `@ericssonbroadcastservices/*` package you want to use
3. `npm link ../path/to/sdk/packages/package-you-want-to-use`

Note that ANY `npm install` action MAY break the linking, in which case simply redo step 3. 

To cleanup the changes made to all the `package.json` files run `npm run build:clean`. 

## Monorepo

This repository is a monorepo which means that the code is separated into multiple indivudual "packages", packages are allowed to depend on each-other but may not import
files directly eg. `import x from '../../packages/core/src/x` is not allowed.

The public packages that are released to npm are `player` and `web-component` and when published they are scoped under `@redbeemedia/`.
All code & types for the `player` package is bundled so SDK customer are not aware of our internal structure, types for example are bundled using `@microsoft/api-extractor` which will remove any reference to different packages. This means that believe that all types come from the player which is not true, for example some types will come from [here](https://github.com/EricssonBroadcastServices/javascript-sdk/tree/master/packages/exposure), keep that in mind when talking with SDK customers.

## Release packages internally to the GitHub package registry

Before making any release make sure that the E2E tests work by running `npm run e2e`. This will launch several browser windows that will test the player with most of the content we need to support.

To be able to use our packages from our other repos, we release them to the GitHub package registry (private access, restricted to our GitHub organization).

Run the following from the master branch:

```sh
npm run lerna:internal-version
```

This will bump all package versions with the new version, create a new commit, tag the commit with the version name, and then push the commit. This in turn will trigger a GitHub Actions workflow making the release.

The version will be following the semver standards (derived from our commit messages), and adding a suffix `-internal.{N}`. This suffix will avoid squatting a version number until we want to publish it on npm. *If you want to make a public (npm) release instead, see below.*

### Release packages to NPM

Making a public release starts with the same step as making an internal release, except use the command `npm run lerna:version`.

As the previous section, this will release our packages to the GitHub package registry. The npm release is handled by a second step:

1. [Draft a new GitHub release](https://github.com/EricssonBroadcastServices/javascript-player/releases/new)
2. In the input field "Tag version" search for the version you want to release, the top tag should be the one you just created using the above npm script
3. Select the top entry and go to the end of the input field to verify that it is indeed the correct version
4. Create a release title, eg. `v0.1.2`
5. Publish the release

This will trigger another GitHub action that handles the rest.
