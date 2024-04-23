<!--
SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>

SPDX-License-Identifier: CC-BY-SA-4.0
-->

# [1.6.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v1.6.0-internal.2...v1.6.0) (2024-04-03)



# [1.6.0-internal.2](https://github.com/ericssonbroadcastservices/javascript-player/compare/v1.6.0-internal.1...v1.6.0-internal.2) (2024-03-28)


### Bug Fixes

* **EMP-21396:** properly parse urls when throwing errors in exposure service ([#646](https://github.com/ericssonbroadcastservices/javascript-player/issues/646)) ([bd50ad2](https://github.com/ericssonbroadcastservices/javascript-player/commit/bd50ad24fc404b9438847ddaa062dd3b5adff26f))
* **internal:** hls.js todos. magic number & unnecessary [@ts-ignore](https://github.com/ts-ignore) ([#643](https://github.com/ericssonbroadcastservices/javascript-player/issues/643)) ([da0c38b](https://github.com/ericssonbroadcastservices/javascript-player/commit/da0c38bd5a94a3630e3aec69c2aef96429c3915b))
* **internal:** re-export `TAppType` from player ([c8e2f3e](https://github.com/ericssonbroadcastservices/javascript-player/commit/c8e2f3eaedf0872b5f978a72918c937972b3f998))
* **internal:** release & change notes not genereated correctly ([#642](https://github.com/ericssonbroadcastservices/javascript-player/issues/642)) ([6e1b6e9](https://github.com/ericssonbroadcastservices/javascript-player/commit/6e1b6e9b84b4c76634e10f5a0d9c07ff1e392f5d))


### Features

* **EMP-18680:** support FAIRPLAY_LICENSE_ERROR and FAIRPLAY_CERTIFICATE_ERROR metrics ([#644](https://github.com/ericssonbroadcastservices/javascript-player/issues/644)) ([76bd5c1](https://github.com/ericssonbroadcastservices/javascript-player/commit/76bd5c14cbe2656548bf1d16f1c12670f84517d2))



# [1.6.0-internal.1](https://github.com/ericssonbroadcastservices/javascript-player/compare/v1.6.0-internal.0...v1.6.0-internal.1) (2024-03-06)


### Bug Fixes

* **EMP-21233:** do not show forced text tracks as selectable ([#639](https://github.com/ericssonbroadcastservices/javascript-player/issues/639)) ([92dc6c4](https://github.com/ericssonbroadcastservices/javascript-player/commit/92dc6c4eb2e0139d186ecaba96d18b8e7e18e487))



# [1.6.0-internal.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v1.5.2-internal.0...v1.6.0-internal.0) (2024-02-29)


### Bug Fixes

* **EMP-21052:** reenable the pingstate when it is a single program and has ended ([#638](https://github.com/ericssonbroadcastservices/javascript-player/issues/638)) ([c730611](https://github.com/ericssonbroadcastservices/javascript-player/commit/c7306118d30d3f9faaba54f794cfd056145a1691))


### Features

* **internal:** add document.visibility to deviceStats ([#640](https://github.com/ericssonbroadcastservices/javascript-player/issues/640)) ([7b436a8](https://github.com/ericssonbroadcastservices/javascript-player/commit/7b436a8246a10597eef4919bf143b65656f3ac70))



## [1.5.2-internal.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v1.5.1...v1.5.2-internal.0) (2024-02-12)


### Bug Fixes

* **internal:** hls.js never recovers from network error ([#633](https://github.com/ericssonbroadcastservices/javascript-player/issues/633)) ([d1f7c5e](https://github.com/ericssonbroadcastservices/javascript-player/commit/d1f7c5ea555219b600ea2a36158e8e90bf2896a0))



## [1.5.1](https://github.com/ericssonbroadcastservices/javascript-player/compare/v1.5.0...v1.5.1) (2024-01-24)


### Bug Fixes

* low latency stream not catching up correctly ([640f490](https://github.com/ericssonbroadcastservices/javascript-player/commit/640f490dfeeb8d7758832d0505138da8d62f1eed))



# [1.5.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v1.5.0-internal.0...v1.5.0) (2024-01-24)



# [1.5.0-internal.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v1.4.0...v1.5.0-internal.0) (2024-01-18)


### Bug Fixes

* **EMP-21044:** playbackRate decreased when playing low latency content close to live edge ([#628](https://github.com/ericssonbroadcastservices/javascript-player/issues/628)) ([064dbb3](https://github.com/ericssonbroadcastservices/javascript-player/commit/064dbb348ae9f433de3dad6389f41ccae26a2a4b))
* **EMP-21063:** add ProgramAssetId to programChanged event in analytics ([#626](https://github.com/ericssonbroadcastservices/javascript-player/issues/626)) ([43a38fb](https://github.com/ericssonbroadcastservices/javascript-player/commit/43a38fb89071971a81f19f3782cbad678bd86e00))
* **internal:** remove uid from adsOptions, it should be handled by the backend ([ced04cd](https://github.com/ericssonbroadcastservices/javascript-player/commit/ced04cd63cf36ed955cf8c3ee507cecd54b52d49))
* unhandled rejection error when load media fails ([#624](https://github.com/ericssonbroadcastservices/javascript-player/issues/624)) ([7a49662](https://github.com/ericssonbroadcastservices/javascript-player/commit/7a49662c98827dc54d24325a3d6c479578053fa7))


### Features

* **EMP-20973:internal:** integration tests based on players/sdktesting ([#623](https://github.com/ericssonbroadcastservices/javascript-player/issues/623)) ([342e125](https://github.com/ericssonbroadcastservices/javascript-player/commit/342e1258d51bcfea8956dcce5556e5bdd67d4324))



# [1.4.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v1.4.0-internal.1...v1.4.0) (2023-12-22)


### Bug Fixes

* .play() return type is void, should be Promise<void> ([#625](https://github.com/ericssonbroadcastservices/javascript-player/issues/625)) ([1eb4e20](https://github.com/ericssonbroadcastservices/javascript-player/commit/1eb4e209e11bbcbc016f2a141ecf16e07c9e3f3d))
* always use epgs as program source in the program service ([#614](https://github.com/ericssonbroadcastservices/javascript-player/issues/614)) ([e29ed3e](https://github.com/ericssonbroadcastservices/javascript-player/commit/e29ed3e0922215f2ace15c0b5531d7f4313d9b78))
* **internal:** bump media-event-filter to allow `allowResumeAfterEnded` ([#622](https://github.com/ericssonbroadcastservices/javascript-player/issues/622)) ([943a09b](https://github.com/ericssonbroadcastservices/javascript-player/commit/943a09b4903e1cf63625ca82040f50efac4d8edc))
* typeError thrown when trying to access track info too early ([#620](https://github.com/ericssonbroadcastservices/javascript-player/issues/620)) ([a85cb84](https://github.com/ericssonbroadcastservices/javascript-player/commit/a85cb841182a413eba4069db4d100794df65f31f))


### Features

* **analytics:** add clockOffset to analytics payload ([#611](https://github.com/ericssonbroadcastservices/javascript-player/issues/611)) ([aca1be6](https://github.com/ericssonbroadcastservices/javascript-player/commit/aca1be6d9a2184b6237c46800d3f98194c3cf372))
* **EMP-20973:internal:** restore e2e tests ([#619](https://github.com/ericssonbroadcastservices/javascript-player/issues/619)) ([247812d](https://github.com/ericssonbroadcastservices/javascript-player/commit/247812d5b112358a9bcb476f7cfcdea2c5c305c3))



# [1.4.0-internal.1](https://github.com/ericssonbroadcastservices/javascript-player/compare/v1.4.0-internal.0...v1.4.0-internal.1) (2023-12-12)


### Bug Fixes

* **internal:** fix release notes using the wrong date ([3f7e653](https://github.com/ericssonbroadcastservices/javascript-player/commit/3f7e65387f4e348c1a376b0159d80553f1019893))
* isBrowserSupported not detecting lg tv & samsung tv 2017+ as supported ([#613](https://github.com/ericssonbroadcastservices/javascript-player/issues/613)) ([a6b6ef7](https://github.com/ericssonbroadcastservices/javascript-player/commit/a6b6ef78528f6e0739662a8ab08d8c140e7c40cf))
* **native engine:** set UTC startTime and currentTime before triggering the LOADED event ([#616](https://github.com/ericssonbroadcastservices/javascript-player/issues/616)) ([d2e881e](https://github.com/ericssonbroadcastservices/javascript-player/commit/d2e881e47d8df63c2825c29397b911d410cb66f3))
* ssai not working with playready ([#617](https://github.com/ericssonbroadcastservices/javascript-player/issues/617)) ([8e5a515](https://github.com/ericssonbroadcastservices/javascript-player/commit/8e5a5158704023812b0e1fa606fac1d69839bd31))



# [1.4.0-internal.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v1.3.0...v1.4.0-internal.0) (2023-12-07)


### Bug Fixes

* emit PlayerEvent.ERROR for cast load error ([#598](https://github.com/ericssonbroadcastservices/javascript-player/issues/598)) ([53303bf](https://github.com/ericssonbroadcastservices/javascript-player/commit/53303bf1f1b5ba527b6552e6ddedb8f92822df7d))
* **EMP-20948:** seek doesn't work on low latency channels ([#604](https://github.com/ericssonbroadcastservices/javascript-player/issues/604)) ([03015a1](https://github.com/ericssonbroadcastservices/javascript-player/commit/03015a17094bdecf9eb67b4fc4a87fb29867b77f))
* **EMP-20992:** microsoft edge can't play HEVC streams with DRM protection ([#610](https://github.com/ericssonbroadcastservices/javascript-player/issues/610)) ([d7b2a60](https://github.com/ericssonbroadcastservices/javascript-player/commit/d7b2a60b3a0db03e8c69e4529c11f6a7e98a7ada))
* **EMP-20993:** multi-line subtitle rendering ([#609](https://github.com/ericssonbroadcastservices/javascript-player/issues/609)) ([1474943](https://github.com/ericssonbroadcastservices/javascript-player/commit/14749432844ab954133e0ac01c4fabf1fc487546))
* **internal:** demo app unnecessarily imports the player style ([74e65d8](https://github.com/ericssonbroadcastservices/javascript-player/commit/74e65d8a94d43291c180a040df80441e24ab41b0))
* **internal:** fix bad reference in release workflow ([63d7d11](https://github.com/ericssonbroadcastservices/javascript-player/commit/63d7d1150d90c4a8c6202c721319ac0f82618737))
* **internal:** skin not included in built demo ([#608](https://github.com/ericssonbroadcastservices/javascript-player/issues/608)) ([097368a](https://github.com/ericssonbroadcastservices/javascript-player/commit/097368a9f410ef2e5896ec98d0b2c12481f222ea))
* low latency channels latency higher than 1 fragment duration ([#605](https://github.com/ericssonbroadcastservices/javascript-player/issues/605)) ([ee84b8b](https://github.com/ericssonbroadcastservices/javascript-player/commit/ee84b8bb7c880502df7a95b3a875c112db8ee90f))
* **skin:** poster not fully visible ([#601](https://github.com/ericssonbroadcastservices/javascript-player/issues/601)) ([c5b31e7](https://github.com/ericssonbroadcastservices/javascript-player/commit/c5b31e7c0be8170b49fabb04dd37db94fecad462))


### Features

* **analytics:** set os name & verison for analytics instead of parsing userAgent ([#606](https://github.com/ericssonbroadcastservices/javascript-player/issues/606)) ([27165f6](https://github.com/ericssonbroadcastservices/javascript-player/commit/27165f6cbdc237c216f48c023abc813c388f0310))
* **EMP-18166:** add translations for player skin strings ([#602](https://github.com/ericssonbroadcastservices/javascript-player/issues/602)) ([418c610](https://github.com/ericssonbroadcastservices/javascript-player/commit/418c6101a5c62b4fe15e88337437bc2760ab2769))



# [1.3.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v1.3.0-internal.4...v1.3.0) (2023-11-20)



# [1.3.0-internal.4](https://github.com/ericssonbroadcastservices/javascript-player/compare/v1.3.0-internal.3...v1.3.0-internal.4) (2023-11-16)


### Bug Fixes

* **internal:** startTime NaN ([e562ec2](https://github.com/ericssonbroadcastservices/javascript-player/commit/e562ec21e34aa8f4efed56063bcfa915af136710))



# [1.3.0-internal.3](https://github.com/ericssonbroadcastservices/javascript-player/compare/v1.3.0-internal.2...v1.3.0-internal.3) (2023-11-16)


### Bug Fixes

* **EMP-20808:** lg, some catchup content not starting ([468fcb6](https://github.com/ericssonbroadcastservices/javascript-player/commit/468fcb60aafb9cc52f75e8e72b9605c8f4351c4c))
* **EMP-20927:** web component skin not being built ([#600](https://github.com/ericssonbroadcastservices/javascript-player/issues/600)) ([04d2ec7](https://github.com/ericssonbroadcastservices/javascript-player/commit/04d2ec7d51d2413b5acd18f651f4092acf938497))
* stuck at buffering when starting certain catchup content ([fe9f024](https://github.com/ericssonbroadcastservices/javascript-player/commit/fe9f024e3d019fc5436179d66954fb8643f889c3))



# [1.3.0-internal.2](https://github.com/ericssonbroadcastservices/javascript-player/compare/v1.3.0-internal.1...v1.3.0-internal.2) (2023-11-07)


### Bug Fixes

* captions sometimes not showing as active ([6d5dfc8](https://github.com/ericssonbroadcastservices/javascript-player/commit/6d5dfc8c4c379a3297f2b7efaef32da83a418e97))
* content sometimes not starting after adbreak on samsung tv ([5675e20](https://github.com/ericssonbroadcastservices/javascript-player/commit/5675e2087830c0d94ee5e0e6a846bdb9c4b6920c))
* **internal:** broken package-lock ([5909103](https://github.com/ericssonbroadcastservices/javascript-player/commit/5909103d40134a19a74d793757852218da17ad78))



# [1.3.0-internal.1](https://github.com/ericssonbroadcastservices/javascript-player/compare/v1.3.0-internal.0...v1.3.0-internal.1) (2023-11-07)


### Bug Fixes

* firefox crashes frequently on live content ([#594](https://github.com/ericssonbroadcastservices/javascript-player/issues/594)) ([ecc8f9a](https://github.com/ericssonbroadcastservices/javascript-player/commit/ecc8f9a59991fb36eb397d806a0dd7da9f2d2b24))
* **internal:demo:** small improvements ([02dbfee](https://github.com/ericssonbroadcastservices/javascript-player/commit/02dbfeec7f034615fc0e8b2c0ff0eaf0adde3694))



# [1.3.0-internal.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v1.2.1...v1.3.0-internal.0) (2023-10-30)


### Bug Fixes

* add missing polyfills to demo package.json ([eadd194](https://github.com/ericssonbroadcastservices/javascript-player/commit/eadd194f6fb84992146c1cbab3bd8c6c8ae6113b))
* firefox crashing when playing certain live content ([#592](https://github.com/ericssonbroadcastservices/javascript-player/issues/592)) ([c76c4fa](https://github.com/ericssonbroadcastservices/javascript-player/commit/c76c4fa5ac80ada0726b7c2dccaa482d8c57a7f9))
* **internal:demo:** always update new session token datalist when the cu/bu changes ([5e09180](https://github.com/ericssonbroadcastservices/javascript-player/commit/5e09180399b87cf27ea70733c33b6313c4efb710))
* **internal:demo:** fix dark mode css for the modal ([35e3011](https://github.com/ericssonbroadcastservices/javascript-player/commit/35e30119f5b033bc6e44fae7b0ecd8ba85f4068c))


### Features

* **EMP-20719:** ES5 transpiled bundle ([#587](https://github.com/ericssonbroadcastservices/javascript-player/issues/587)) ([1b021e9](https://github.com/ericssonbroadcastservices/javascript-player/commit/1b021e98946f6c1c417f5a8f928ba8d732fead90))
* **internal:demo:** add title for the new button ([3e67b2e](https://github.com/ericssonbroadcastservices/javascript-player/commit/3e67b2e09a068e360e12830afa1b1357b5f87707))
* **internal:demo:** redesign demo authentication ui ([#589](https://github.com/ericssonbroadcastservices/javascript-player/issues/589)) ([7d64c21](https://github.com/ericssonbroadcastservices/javascript-player/commit/7d64c21257e5c97cf3d6be06de0d5ac794bed16e))
* **internal:demo:** replace side-bar with share modal ([#590](https://github.com/ericssonbroadcastservices/javascript-player/issues/590)) ([f3b7588](https://github.com/ericssonbroadcastservices/javascript-player/commit/f3b7588f6056335dd8f7fb81596581f4a38d481b))



## [1.2.1](https://github.com/ericssonbroadcastservices/javascript-player/compare/v1.2.0...v1.2.1) (2023-10-25)


### Bug Fixes

* **EMP-20813:** fix ads click through button not showing in mobile skin ([#588](https://github.com/ericssonbroadcastservices/javascript-player/issues/588)) ([dcf5e67](https://github.com/ericssonbroadcastservices/javascript-player/commit/dcf5e679f72e699a7d3012af6e5b55546a718e88))



# [1.2.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v1.2.0-internal.3...v1.2.0) (2023-10-20)


### Bug Fixes

* **internal:demo:** dont try to fetch assets unless we have customer && businessUnit ([9e14f4b](https://github.com/ericssonbroadcastservices/javascript-player/commit/9e14f4b82468158287253e4f7f3163f6771f5bae))
* **internal:demo:** set global debuggable player instance _before_ load ([ccb542b](https://github.com/ericssonbroadcastservices/javascript-player/commit/ccb542bc0199ccf24d0d5625c81b306614bbd765))


### Features

* **internal:demo:** update assets list on blur event too ([fe5b77f](https://github.com/ericssonbroadcastservices/javascript-player/commit/fe5b77f9ee4e9388539764ea29ac3b7c6428782e))



# [1.2.0-internal.3](https://github.com/ericssonbroadcastservices/javascript-player/compare/v1.2.0-internal.2...v1.2.0-internal.3) (2023-10-17)


### Bug Fixes

* **internal:** make sure to reset cu/bu datalists for demo/dev page if there is no history match ([7e22847](https://github.com/ericssonbroadcastservices/javascript-player/commit/7e228479502c96b91e7c9a44569c0f5dac81cb9b))
* prevent trying to set shaka config restrictions after destroying shaka ([95213bd](https://github.com/ericssonbroadcastservices/javascript-player/commit/95213bd337c2a6ee41c8957ce54869c9d96e4adf))



# [1.2.0-internal.2](https://github.com/ericssonbroadcastservices/javascript-player/compare/v1.2.0-internal.1...v1.2.0-internal.2) (2023-10-17)


### Bug Fixes

* **internal:** updare exposure ([01fe12b](https://github.com/ericssonbroadcastservices/javascript-player/commit/01fe12b7ac91f90e55a77ed4ad53867d471b47b4))


### Features

* **internal:** add options to the portal player ([feb5816](https://github.com/ericssonbroadcastservices/javascript-player/commit/feb58161026975653e831165c00e315069a5d2dc))



# [1.2.0-internal.1](https://github.com/ericssonbroadcastservices/javascript-player/compare/v1.2.0-internal.0...v1.2.0-internal.1) (2023-10-12)


### Bug Fixes

* **EMP-20511:** add missing exports, skin options ([#585](https://github.com/ericssonbroadcastservices/javascript-player/issues/585)) ([46d9bb3](https://github.com/ericssonbroadcastservices/javascript-player/commit/46d9bb3d1b172c9ef2dc5ca28d277c6670426a66))



# [1.2.0-internal.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v1.1.0...v1.2.0-internal.0) (2023-10-09)


### Features

* **EMP-20511:** support chromecast receiver with queue ([#567](https://github.com/ericssonbroadcastservices/javascript-player/issues/567)) ([d42e6f7](https://github.com/ericssonbroadcastservices/javascript-player/commit/d42e6f7aefa4b73d853ecb0f6f6494f84ea4f629))



# [1.1.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v1.1.0-internal.0...v1.1.0) (2023-10-06)


### Bug Fixes

* **dashjs:** add workaround for dashjs-engine overriding user audio track preferences after ad break ([#579](https://github.com/ericssonbroadcastservices/javascript-player/issues/579)) ([3ad9a29](https://github.com/ericssonbroadcastservices/javascript-player/commit/3ad9a295d6c76a9a70f9d4830f5b1512fd5809d0))
* **dashjs:** fix subtitle duplication issues when using the dashjs engine ([#578](https://github.com/ericssonbroadcastservices/javascript-player/issues/578)) ([9d32b26](https://github.com/ericssonbroadcastservices/javascript-player/commit/9d32b265a639bfa4e52cefb115234c60624e08f1))
* **EMP-20618:** filter out ads-only languages from the audio language options ([#581](https://github.com/ericssonbroadcastservices/javascript-player/issues/581)) ([ce1925e](https://github.com/ericssonbroadcastservices/javascript-player/commit/ce1925ef56dd3158bc65d8e85a73bf54b72f0f17))
* **internal:** playready crashes dash.js, add playready/mss overrides to demo ([#580](https://github.com/ericssonbroadcastservices/javascript-player/issues/580)) ([1afc078](https://github.com/ericssonbroadcastservices/javascript-player/commit/1afc07870383f0234e9f9a2b69079f7f217d1899))
* preferred language doesn't work if metadata is missing ([#575](https://github.com/ericssonbroadcastservices/javascript-player/issues/575)) ([8b00a20](https://github.com/ericssonbroadcastservices/javascript-player/commit/8b00a20354ca2f1cfe608122d29786536d1adceb))
* upgrade to shaka 4.4.3 ([#583](https://github.com/ericssonbroadcastservices/javascript-player/issues/583)) ([d9a285d](https://github.com/ericssonbroadcastservices/javascript-player/commit/d9a285d9629b3702844b731b93cba2044f23d128))


### Features

* **core:** upgrade dashjs to 4.7.2 ([#577](https://github.com/ericssonbroadcastservices/javascript-player/issues/577)) ([354ba05](https://github.com/ericssonbroadcastservices/javascript-player/commit/354ba05f0590443d2a9c0181ccf40e5241797d6d))
* **internal:** ui for selecting events to log ([#574](https://github.com/ericssonbroadcastservices/javascript-player/issues/574)) ([0d4a539](https://github.com/ericssonbroadcastservices/javascript-player/commit/0d4a53975fd4837e2e139d5dfe362e3ea83da5f9))



# [1.1.0-internal.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v1.0.2...v1.1.0-internal.0) (2023-09-28)


### Bug Fixes

* check if startTime is specifically not undefined ([#572](https://github.com/ericssonbroadcastservices/javascript-player/issues/572)) ([c5c25bd](https://github.com/ericssonbroadcastservices/javascript-player/commit/c5c25bdb60e524d8ca2d757a5ed00710c9ae185d))
* Fix Shaka engine configuration so that subtitle streams update more reliably ([#571](https://github.com/ericssonbroadcastservices/javascript-player/issues/571)) ([0b678ca](https://github.com/ericssonbroadcastservices/javascript-player/commit/0b678ca1ca9bd48e5dc75a2d14ae028e6d114258))
* togglePictureInPicture crashes on audioOnly content ([#570](https://github.com/ericssonbroadcastservices/javascript-player/issues/570)) ([e16ef5a](https://github.com/ericssonbroadcastservices/javascript-player/commit/e16ef5aaf4456628162edec93e85df692c932d6d))


### Features

* **core:** upgrade shaka to 4.4.2 ([#573](https://github.com/ericssonbroadcastservices/javascript-player/issues/573)) ([8748afe](https://github.com/ericssonbroadcastservices/javascript-player/commit/8748afed750385bb37da1633b9b67a3f486ceebd))



## [1.0.2](https://github.com/ericssonbroadcastservices/javascript-player/compare/v1.0.1...v1.0.2) (2023-09-22)


### Bug Fixes

* **EMP-20193:** analytics receiving bps instead kbps ([#560](https://github.com/ericssonbroadcastservices/javascript-player/issues/560)) ([42ae4db](https://github.com/ericssonbroadcastservices/javascript-player/commit/42ae4db4e8de1075623883d8b74eeee3af735be0))
* **EMP-20424:** webOS 4.x live seek moves seekable end to seek position. [#564](https://github.com/ericssonbroadcastservices/javascript-player/issues/564)  ([#565](https://github.com/ericssonbroadcastservices/javascript-player/issues/565)) ([f183690](https://github.com/ericssonbroadcastservices/javascript-player/commit/f18369052c00058260ee949a3aa85689109150f9))
* **EMP-20429:** support startTime argument 0 for live streams ([#563](https://github.com/ericssonbroadcastservices/javascript-player/issues/563)) ([2f296fa](https://github.com/ericssonbroadcastservices/javascript-player/commit/2f296faf6e3d590895f0ca4413831eb0463c89e7))
* **EMP-20447:** hls live streams not seekable on WebOS 3.5 ([#566](https://github.com/ericssonbroadcastservices/javascript-player/issues/566)) ([24e7fc9](https://github.com/ericssonbroadcastservices/javascript-player/commit/24e7fc9999d732001041ca61aa0d1d02c0ae0fdd))
* **EMP-20554:** Fix subtitles not showing after an ad break ([#569](https://github.com/ericssonbroadcastservices/javascript-player/issues/569)) ([185ebdf](https://github.com/ericssonbroadcastservices/javascript-player/commit/185ebdff9469a6acc9328c75c7f6b668181027a3))
* live streams starts from beginning ([#568](https://github.com/ericssonbroadcastservices/javascript-player/issues/568)) ([001c505](https://github.com/ericssonbroadcastservices/javascript-player/commit/001c505d1634088881910d98e5e26fb032a2abf3))



## [1.0.1](https://github.com/ericssonbroadcastservices/javascript-player/compare/v1.0.0...v1.0.1) (2023-07-07)


### Bug Fixes

* ads options not passed in play request ([#559](https://github.com/ericssonbroadcastservices/javascript-player/issues/559)) ([c6db506](https://github.com/ericssonbroadcastservices/javascript-player/commit/c6db506bb1450505c4079f4e8830994b5de8c0cb))



# [1.0.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.69.0...v1.0.0) (2023-06-29)


### Bug Fixes

* autoplay detection doesn't work on samsung ([#554](https://github.com/ericssonbroadcastservices/javascript-player/issues/554)) ([53ed9dd](https://github.com/ericssonbroadcastservices/javascript-player/commit/53ed9dd94deeb835f56715b342baa92659fbf520))
* avoid nested classes (higher CSS specificity than documented) for subtitles ([#532](https://github.com/ericssonbroadcastservices/javascript-player/issues/532)) ([eefa4c1](https://github.com/ericssonbroadcastservices/javascript-player/commit/eefa4c10b7de4623ebf5c6e591a3cbed71e6f625))
* **EMP-19459:** live channels always starts at live edge ([#555](https://github.com/ericssonbroadcastservices/javascript-player/issues/555)) ([a03479a](https://github.com/ericssonbroadcastservices/javascript-player/commit/a03479aaca464759a3089131be413da1c20cc25b))
* **EMP-19779:** virtual channels, only first program detected ([#518](https://github.com/ericssonbroadcastservices/javascript-player/issues/518)) ([a2fbe60](https://github.com/ericssonbroadcastservices/javascript-player/commit/a2fbe60caec7026fd2d2ffbb276568ba70d2ed2e))
* **EMP-19850:** Fix web-components attribute change issues ([#502](https://github.com/ericssonbroadcastservices/javascript-player/issues/502)) ([8b88f51](https://github.com/ericssonbroadcastservices/javascript-player/commit/8b88f519fcae40f83c83f20c01b8fee1fa574c7b))
* **EMP-20141:** fix SSAI player not respecting user track choices, by switching internal player to Shaka ([#544](https://github.com/ericssonbroadcastservices/javascript-player/issues/544)) ([723ae85](https://github.com/ericssonbroadcastservices/javascript-player/commit/723ae85e7c69389724717de01ef9efbe20fd0241))
* **EMP-20184,EMP-17725:** fix playbackRate blocking for AdsInsertionPlayer ([#551](https://github.com/ericssonbroadcastservices/javascript-player/issues/551)) ([61ce985](https://github.com/ericssonbroadcastservices/javascript-player/commit/61ce985ed391465a7b735729846e30b286003f07))
* hls live: invalid duration & seekable ([#487](https://github.com/ericssonbroadcastservices/javascript-player/issues/487)) ([99ea8d3](https://github.com/ericssonbroadcastservices/javascript-player/commit/99ea8d342d64037859e9521b4c5ada7352ad6c42))
* **internal:analytics:** workaround for chromecast analytics event unlistener ([#460](https://github.com/ericssonbroadcastservices/javascript-player/issues/460)) ([dbf1299](https://github.com/ericssonbroadcastservices/javascript-player/commit/dbf1299f145845c70039897df465e329cd120e5c))
* **internal:demo:** fix green streaming button ([557c8c4](https://github.com/ericssonbroadcastservices/javascript-player/commit/557c8c4eaba8fff3223d8a11c8d484244e7e213e))
* **internal:demo:** ported from v0 - don't store anonymous sessionTokens ([aebe5f7](https://github.com/ericssonbroadcastservices/javascript-player/commit/aebe5f7837af3ac0030e5945287cec79d2af9d96))
* **internal:demo:** small fixes to demo page ([#478](https://github.com/ericssonbroadcastservices/javascript-player/issues/478)) ([62ad31b](https://github.com/ericssonbroadcastservices/javascript-player/commit/62ad31b5024e5a805fc4b8100b296577ea187a00))
* **internal:EMP-19689:** ported from v0 - timeline not fully seekable, hls|chrome,firefox,edge ([#466](https://github.com/ericssonbroadcastservices/javascript-player/issues/466)) ([bfc89f1](https://github.com/ericssonbroadcastservices/javascript-player/commit/bfc89f1deca974ec1da56646d620d94f60383faf))
* **internal:EMP-19734:** fix crash with overlay widget manager when destructing ([a3d9e3a](https://github.com/ericssonbroadcastservices/javascript-player/commit/a3d9e3a8491782e7969e4c46c4a71332a4ccbcdb))
* **internal:EMP-20021:** ported from v0 - nowtilus lg workaround applied for all stitchers ([#533](https://github.com/ericssonbroadcastservices/javascript-player/issues/533)) ([8196023](https://github.com/ericssonbroadcastservices/javascript-player/commit/8196023aa27fa78d0967479bbefacfe113b54022))
* **internal:EMP-20184,EMP-17725:** ported from v0 - fix playbackRate blocking for AdsInsertionPlayer ([#551](https://github.com/ericssonbroadcastservices/javascript-player/issues/551)) ([17e0d1b](https://github.com/ericssonbroadcastservices/javascript-player/commit/17e0d1bd87fe2e735d2b75d4c177e15817c45f50))
* **internal:** analytics eventpool doesn't reset after sending ([#528](https://github.com/ericssonbroadcastservices/javascript-player/issues/528)) ([efdda8c](https://github.com/ericssonbroadcastservices/javascript-player/commit/efdda8ca346c23e28ef0933fca4aac74fe19ace4))
* **internal:** don't try to load next from playlist if there is only one item ([c9fc301](https://github.com/ericssonbroadcastservices/javascript-player/commit/c9fc301ea19f8bc7a1bc3e033fdd2eae33344f24))
* **internal:** fix castAppId input ([e115328](https://github.com/ericssonbroadcastservices/javascript-player/commit/e115328ad841fee5422fc66156f4cb0dc184d078))
* **internal:** fix e2e tests ([6ed2a20](https://github.com/ericssonbroadcastservices/javascript-player/commit/6ed2a2075ec1f90cc21b474b03b430fcfeacc210))
* **internal:** fix player-plugins src prop ([c7e849c](https://github.com/ericssonbroadcastservices/javascript-player/commit/c7e849c69613f5a07425f7ff3086c50a0b36ee66))
* **internal:** nowtilus crashing due to missing tracking urls ([4a8518a](https://github.com/ericssonbroadcastservices/javascript-player/commit/4a8518a780eb6c4679625d9947fffaa43dca79b1))
* **internal:** npm run dev doesn't work ([b0f200e](https://github.com/ericssonbroadcastservices/javascript-player/commit/b0f200ebd6877f76d9af9612564735c84bb884be))
* **internal:** ported from v0 - fix content pausing after ads[dash, ssai] ([bbaa6b4](https://github.com/ericssonbroadcastservices/javascript-player/commit/bbaa6b4a925a8aad9278e9df49cd4f595cd6405c))
* **internal:** remove border-radius added by simple.css from web-component demo ([eca5a95](https://github.com/ericssonbroadcastservices/javascript-player/commit/eca5a9573d194db820550d9fe7b6378c082a99d5))
* **internal:** SSAI playback crashes at startup ([d7bc2b4](https://github.com/ericssonbroadcastservices/javascript-player/commit/d7bc2b4ff9c4c00de65f743b0b7ca9e629094417))
* **internal:** typo in LG device adapter ([fd46c99](https://github.com/ericssonbroadcastservices/javascript-player/commit/fd46c9958fd58012742b65e9f40c12756e5b9a8d))
* **internal:** version is 'dev-build' in analytics ([#546](https://github.com/ericssonbroadcastservices/javascript-player/issues/546)) ([4a0c8c9](https://github.com/ericssonbroadcastservices/javascript-player/commit/4a0c8c97ee1afd1760a5e4ad412449f51c1bdaa5))
* **internal:** wrong analytics version provided ([#549](https://github.com/ericssonbroadcastservices/javascript-player/issues/549)) ([c006fc7](https://github.com/ericssonbroadcastservices/javascript-player/commit/c006fc70e8c5cd866e939f2b31cbdb957994a514))
* track id type is always string when it can be number ([#550](https://github.com/ericssonbroadcastservices/javascript-player/issues/550)) ([f8d57f8](https://github.com/ericssonbroadcastservices/javascript-player/commit/f8d57f8b892b0721d7599fafc6e58e8ef583bb4c))
* volume & text tracks event not working on safari ([#547](https://github.com/ericssonbroadcastservices/javascript-player/issues/547)) ([62a1ebe](https://github.com/ericssonbroadcastservices/javascript-player/commit/62a1ebea09e3bfc59f9796fcc656193fe952a851))


### Features

* add type to browser device model ([#548](https://github.com/ericssonbroadcastservices/javascript-player/issues/548)) ([9928039](https://github.com/ericssonbroadcastservices/javascript-player/commit/99280393d00c38e9f21fcc4147d1433b3dc15373))
* automatically detect samsung & lg tv devices ([#446](https://github.com/ericssonbroadcastservices/javascript-player/issues/446)) ([b41d7ec](https://github.com/ericssonbroadcastservices/javascript-player/commit/b41d7ecbb4b74f7affa87ee28907d8d251a4cf5d))
* **EMP-17545:** select preferred audio/text subtitles based on locale option ([#514](https://github.com/ericssonbroadcastservices/javascript-player/issues/514)) ([a7f547c](https://github.com/ericssonbroadcastservices/javascript-player/commit/a7f547c4268623fdc3f7f47aa130571e355b2374))
* **EMP-17688:** show error overlay on error ([036da68](https://github.com/ericssonbroadcastservices/javascript-player/commit/036da685bf5e7656c1d01ee57a82a00cf3b48bc0))
* **EMP-19605:** replace audio track icon in default skin to use `account-voice` ([#453](https://github.com/ericssonbroadcastservices/javascript-player/issues/453)) ([723a14e](https://github.com/ericssonbroadcastservices/javascript-player/commit/723a14eb07affa3648dcf31e626812a57164ae69))
* **EMP-19730:** generate device id for all devices ([#463](https://github.com/ericssonbroadcastservices/javascript-player/issues/463)) ([191d6b3](https://github.com/ericssonbroadcastservices/javascript-player/commit/191d6b38af71006a557374ee6c96a0690a97be90))
* **EMP-19746:** add `deviceAdapter` option to allow custom device detection ([#474](https://github.com/ericssonbroadcastservices/javascript-player/issues/474)) ([d25eb19](https://github.com/ericssonbroadcastservices/javascript-player/commit/d25eb19f318ad0077fadc804d1741ef2d60ae8f3))
* **EMP-20108:** Support internal SSAI stitcher ([#542](https://github.com/ericssonbroadcastservices/javascript-player/issues/542)) ([#545](https://github.com/ericssonbroadcastservices/javascript-player/issues/545)) ([0ff7ffc](https://github.com/ericssonbroadcastservices/javascript-player/commit/0ff7ffc74d7262f003c16fb34c03c9e4bb0f6df9))
* **internal:dashjs:** add support for timed metadata when using dash.js ([#461](https://github.com/ericssonbroadcastservices/javascript-player/issues/461)) ([073678d](https://github.com/ericssonbroadcastservices/javascript-player/commit/073678dc6b01f1541e2397d4f151511cecfba2a1))
* **internal:EMP-19604:** replace custom event filtering with eyevinn media-event-filter ([#444](https://github.com/ericssonbroadcastservices/javascript-player/issues/444)) ([3650267](https://github.com/ericssonbroadcastservices/javascript-player/commit/36502673c68323465963d522f0ccf59d5fdad295))
* **internal:EMP-19732:** use defaultPlayer for source and assets ([#484](https://github.com/ericssonbroadcastservices/javascript-player/issues/484)) ([5b78f77](https://github.com/ericssonbroadcastservices/javascript-player/commit/5b78f77c7ded6119bc39f58387fbb616f9638423))
* **internal:EMP-19992:** ported from v0 - bump dash.js to 4.7.0 ([5a74e2c](https://github.com/ericssonbroadcastservices/javascript-player/commit/5a74e2c580e2d31a1d1ac160105d1c55b66bc798))
* **internal:EMP-20024:** migrate from v0 - optional playAsset params start,end ([#537](https://github.com/ericssonbroadcastservices/javascript-player/issues/537)) ([97448c6](https://github.com/ericssonbroadcastservices/javascript-player/commit/97448c6cf0b2c2a3dcc9a5bc83f3fb846ba4d9de))
* **internal:EMP-20108:** ported from v0 - Support internal SSAI stitcher ([#542](https://github.com/ericssonbroadcastservices/javascript-player/issues/542)) ([4433388](https://github.com/ericssonbroadcastservices/javascript-player/commit/443338887453387f7f3c2be387837a9f7cd7f6f8))
* **internal:** add option to override supported & preferred format as well as engine ([#517](https://github.com/ericssonbroadcastservices/javascript-player/issues/517)) ([5d12a93](https://github.com/ericssonbroadcastservices/javascript-player/commit/5d12a9340eb9163104297221b34af3474f668a32))
* **internal:** add start,end,startTime to load options ([#539](https://github.com/ericssonbroadcastservices/javascript-player/issues/539)) ([b1f5eb9](https://github.com/ericssonbroadcastservices/javascript-player/commit/b1f5eb9fd96ddae312ac9f4c3a42fed9921f0b6a))
* **internal:** demo redesign ([#538](https://github.com/ericssonbroadcastservices/javascript-player/issues/538)) ([154760c](https://github.com/ericssonbroadcastservices/javascript-player/commit/154760c5f73efc374b3d27f1f649ca9ec79f9516))
* **internal:** don't filter text tracks from chromecast ([#543](https://github.com/ericssonbroadcastservices/javascript-player/issues/543)) ([c474918](https://github.com/ericssonbroadcastservices/javascript-player/commit/c474918edd1bd4a7eb154a51e9a031433bff9b10))
* **internal:** don't filter text tracks from chromecast ([#543](https://github.com/ericssonbroadcastservices/javascript-player/issues/543)) ([5bb7e50](https://github.com/ericssonbroadcastservices/javascript-player/commit/5bb7e5051805d2f7f47739a5e8600261aa1a3632))
* **internal:** ported from v0 - send program changed events to analytics ([#529](https://github.com/ericssonbroadcastservices/javascript-player/issues/529)) ([6674aaa](https://github.com/ericssonbroadcastservices/javascript-player/commit/6674aaacdb59e8f63ebd1f7c2a84d2e3f162af57))
* set loading state as early as possible ([7d398a5](https://github.com/ericssonbroadcastservices/javascript-player/commit/7d398a5bd7ea4411aee251bd32271b63023b8645))



# [0.69.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.68.0...v0.69.0) (2023-05-30)


### Features

* **EMP-19992:** bump dash.js to 4.7.0 ([027a867](https://github.com/ericssonbroadcastservices/javascript-player/commit/027a867e6feb15ab70f78b7dfcf2e1bf4794a5c2))



# [0.68.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.67.0...v0.68.0) (2023-05-29)


### Features

* **EMP-20024:** add optional playAsset params start,end ([#535](https://github.com/ericssonbroadcastservices/javascript-player/issues/535)) ([14e8465](https://github.com/ericssonbroadcastservices/javascript-player/commit/14e84656a1be4451e6a3712865a1c8f3132b2b88))



# [0.67.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.66.2...v0.67.0) (2023-05-23)


### Bug Fixes

* **EMP-20021:** nowtilus lg workaround applied for all stitchers ([#533](https://github.com/ericssonbroadcastservices/javascript-player/issues/533)) ([dc0e7b7](https://github.com/ericssonbroadcastservices/javascript-player/commit/dc0e7b7d3e532f624cf9b9f576a65263e8ce53e8))


### Features

* **internal:** send program changed events to analytics ([#521](https://github.com/ericssonbroadcastservices/javascript-player/issues/521)) ([2587224](https://github.com/ericssonbroadcastservices/javascript-player/commit/258722409f734e818ffcf043b0832ddb585bdfb6))



## [0.66.2](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.66.1...v0.66.2) (2023-04-14)


### Bug Fixes

* hls live: invalid duration & seekable ([#487](https://github.com/ericssonbroadcastservices/javascript-player/issues/487)) ([1ce0e00](https://github.com/ericssonbroadcastservices/javascript-player/commit/1ce0e00f374081df25cede96e15c5c0076556f77))



## [0.66.1](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.66.0...v0.66.1) (2023-04-13)


### Bug Fixes

* mp3 not playable on LG WebOS 5.0+ ([#485](https://github.com/ericssonbroadcastservices/javascript-player/issues/485)) ([d3dc018](https://github.com/ericssonbroadcastservices/javascript-player/commit/d3dc018f695d2ee58e826a8fa35a1f0549af1a2b))



# [0.66.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.66.0-internal.3...v0.66.0) (2023-04-04)


### Bug Fixes

* **EMP-19592:** add missing PlayerEvent.ERROR event for playlists ([#470](https://github.com/ericssonbroadcastservices/javascript-player/issues/470)) ([3791bc5](https://github.com/ericssonbroadcastservices/javascript-player/commit/3791bc530dc8a2b3069e025cee097c51d88d557f))
* **EMP-19689:** timeline not fully seekable, hls|chrome,firefox,edge ([#466](https://github.com/ericssonbroadcastservices/javascript-player/issues/466)) ([f1dea8e](https://github.com/ericssonbroadcastservices/javascript-player/commit/f1dea8e1e72020f9e0c0ae88c41df98198b34733))
* **internal:EMP-19734:** fix crash with overlay widget manager when destructing ([b9be3ba](https://github.com/ericssonbroadcastservices/javascript-player/commit/b9be3ba4ba9756e2f9962614608854ac0bd37402))



# [0.66.0-internal.3](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.66.0-internal.2...v0.66.0-internal.3) (2023-03-31)


### Bug Fixes

* fix content pausing after ads[dash, ssai] ([7e2b5aa](https://github.com/ericssonbroadcastservices/javascript-player/commit/7e2b5aa3bcb69c68c7c3be5ac4da702e324d15a9))



# [0.66.0-internal.2](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.66.0-internal.1...v0.66.0-internal.2) (2023-03-29)


### Bug Fixes

* **internal:analytics:** revert changes to CastConnector ([#450](https://github.com/ericssonbroadcastservices/javascript-player/issues/450)) ([8ff5e01](https://github.com/ericssonbroadcastservices/javascript-player/commit/8ff5e015108234e92f27fa155c965874beef1afa))
* **internal:analytics:** workaround for chromecast analytics event unlistener ([#460](https://github.com/ericssonbroadcastservices/javascript-player/issues/460)) ([779b8b8](https://github.com/ericssonbroadcastservices/javascript-player/commit/779b8b88be24f38d575b0094e1d4549334d1f144))


### Features

* **EMP-19404/EMP-18218:** support setting default subtitle and audio based on language and kind ([#436](https://github.com/ericssonbroadcastservices/javascript-player/issues/436)) ([7c8dbbe](https://github.com/ericssonbroadcastservices/javascript-player/commit/7c8dbbeedeac8f37a9de43cbeade8ef488cfdc7b))


### Reverts

* Revert "style(EMP-19605): Replace audio track icon in default skin to use `account-voice` (#453)" ([22c621d](https://github.com/ericssonbroadcastservices/javascript-player/commit/22c621d89c9040841547131eda0b3d234e12fa49)), closes [#453](https://github.com/ericssonbroadcastservices/javascript-player/issues/453)



# [0.66.0-internal.1](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.66.0-internal.0...v0.66.0-internal.1) (2023-03-24)


### Bug Fixes

* **internal:analytics:** make deviceInfo optional ([#443](https://github.com/ericssonbroadcastservices/javascript-player/issues/443)) ([c8bbd37](https://github.com/ericssonbroadcastservices/javascript-player/commit/c8bbd372aeaf3ebbd3f134b866f40ca627b9bf0c))



# [0.66.0-internal.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.65.1-internal.0...v0.66.0-internal.0) (2023-03-17)


### Bug Fixes

* bump mux-embed package and js-player dependency ([#427](https://github.com/ericssonbroadcastservices/javascript-player/issues/427)) ([646a9ce](https://github.com/ericssonbroadcastservices/javascript-player/commit/646a9ceeaeaa187db0054ca1ee41e203342f9a3e))
* **EMP-19496:** add support for UTC time for VOD DASH in dash.js ([#430](https://github.com/ericssonbroadcastservices/javascript-player/issues/430)) ([75b5d77](https://github.com/ericssonbroadcastservices/javascript-player/commit/75b5d774e808bea18695f8386bc4ec55bc3d78a1))
* only integers allowed as utcStartTime ([#431](https://github.com/ericssonbroadcastservices/javascript-player/issues/431)) ([5cce98a](https://github.com/ericssonbroadcastservices/javascript-player/commit/5cce98aa4137b4b3055a6adfaee883284b9276fe))
* **program-service:** EPG API error unhandled ([#425](https://github.com/ericssonbroadcastservices/javascript-player/issues/425)) ([f5bcf81](https://github.com/ericssonbroadcastservices/javascript-player/commit/f5bcf8122b88dd312cad2dc92a9c2af9cd6f91db))
* **SD-119259:** forced subtitles are hidden ([#432](https://github.com/ericssonbroadcastservices/javascript-player/issues/432)) ([0b05f91](https://github.com/ericssonbroadcastservices/javascript-player/commit/0b05f914cd4bd6259cd7ec5eddf9e35c03a0efc6))


### Features

* **internal:analytics:** support custom device info from cast receiver ([#442](https://github.com/ericssonbroadcastservices/javascript-player/issues/442)) ([b365ab1](https://github.com/ericssonbroadcastservices/javascript-player/commit/b365ab1f6d3a5986190f95d28806266337ce1364))



## [0.65.1-internal.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.65.0...v0.65.1-internal.0) (2023-02-23)


### Bug Fixes

* **core:** fullscreen promises unhandled ([#419](https://github.com/ericssonbroadcastservices/javascript-player/issues/419)) ([b83155c](https://github.com/ericssonbroadcastservices/javascript-player/commit/b83155ce398790a2295129b1660ef3563eb9a7be))
* **EMP-19471:** LG pauses between ads ([#423](https://github.com/ericssonbroadcastservices/javascript-player/issues/423)) ([bf8ac35](https://github.com/ericssonbroadcastservices/javascript-player/commit/bf8ac3502224a2fe0a06bdd2f266366562cb7502))



# [0.65.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.65.0-internal.0...v0.65.0) (2023-02-22)



# [0.65.0-internal.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.64.0...v0.65.0-internal.0) (2023-02-22)


### Bug Fixes

* include analyticsBaseUrl and analyticsPercentage in analytics payload ([#340](https://github.com/ericssonbroadcastservices/javascript-player/issues/340)) ([ec6ebe2](https://github.com/ericssonbroadcastservices/javascript-player/commit/ec6ebe24153dededee4c4f85957c59e56c8de7d8))


### Features

* **EMP-18984:** use Shaka for SSAI ([#413](https://github.com/ericssonbroadcastservices/javascript-player/issues/413)) ([4cbd011](https://github.com/ericssonbroadcastservices/javascript-player/commit/4cbd011a78609f4d2142d6b341f56e88519469de))



# [0.64.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.63.1...v0.64.0) (2023-02-20)


### Features

* **EMP-18369:** dash.js on LG ([#412](https://github.com/ericssonbroadcastservices/javascript-player/issues/412)) ([198fd80](https://github.com/ericssonbroadcastservices/javascript-player/commit/198fd8087941aa2e94aec3fe7f384b78504ba876))
* **EMP-18811:** add support for startTime and picking up from lastViewedOffset ([#406](https://github.com/ericssonbroadcastservices/javascript-player/issues/406)) ([e034086](https://github.com/ericssonbroadcastservices/javascript-player/commit/e0340868b5a7db8443174a68acbf15f3e5d21608))
* **EMP-19359:** add offset to subtitle container to stay above menu ([#408](https://github.com/ericssonbroadcastservices/javascript-player/issues/408)) ([a19550d](https://github.com/ericssonbroadcastservices/javascript-player/commit/a19550d0130283778227f28de3669d7936c5d204))



## [0.63.1](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.63.0...v0.63.1) (2023-02-16)


### Bug Fixes

* **core-player:** separate subtitle container element into two concerns ([#407](https://github.com/ericssonbroadcastservices/javascript-player/issues/407)) ([f793ba7](https://github.com/ericssonbroadcastservices/javascript-player/commit/f793ba79fad24cd014e876fb8e29aee4a856506c))



# [0.63.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.62.0...v0.63.0) (2023-02-09)


### Bug Fixes

* cannot confidently read errorType & errorGroup from PlayerError ([#404](https://github.com/ericssonbroadcastservices/javascript-player/issues/404)) ([505997e](https://github.com/ericssonbroadcastservices/javascript-player/commit/505997e923072afc8363ddb43eabb5fafbf15146))
* **EMP-19027:** fix chaining ([#403](https://github.com/ericssonbroadcastservices/javascript-player/issues/403)) ([ff68c08](https://github.com/ericssonbroadcastservices/javascript-player/commit/ff68c0826292b325a26b8f2283e3291aca3b0f10))
* **EMP-19273:** make isPictureinPictureSupported() work before setup ([#401](https://github.com/ericssonbroadcastservices/javascript-player/issues/401)) ([08edf02](https://github.com/ericssonbroadcastservices/javascript-player/commit/08edf0231fb59b985656e4ba10850e5200a3c9ad))
* errors are emitted because the player was destroyed ([#405](https://github.com/ericssonbroadcastservices/javascript-player/issues/405)) ([090c67e](https://github.com/ericssonbroadcastservices/javascript-player/commit/090c67e2548574feb7c2ab905f9b91ba6d298ae4))


### Features

* bump player-plugins js-player peer dependency and mux-embed ([#398](https://github.com/ericssonbroadcastservices/javascript-player/issues/398)) ([62e74e2](https://github.com/ericssonbroadcastservices/javascript-player/commit/62e74e2302a7f6b8bb6f47211ba6685893fbe6bd))
* bump Shaka to v4.3.3 ([#333](https://github.com/ericssonbroadcastservices/javascript-player/issues/333)) ([d410b29](https://github.com/ericssonbroadcastservices/javascript-player/commit/d410b29c3fd2d7ced7dd1aa7034f87ca3c973409))
* **EMP-19027:** Spread entitlement ([#396](https://github.com/ericssonbroadcastservices/javascript-player/issues/396)) ([4212a5d](https://github.com/ericssonbroadcastservices/javascript-player/commit/4212a5d8c8e83e29d626a5833259e5f2f104a73a))



# [0.62.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.61.0...v0.62.0) (2023-02-02)


### Bug Fixes

* program service type errors ([#397](https://github.com/ericssonbroadcastservices/javascript-player/issues/397)) ([fda7c38](https://github.com/ericssonbroadcastservices/javascript-player/commit/fda7c38415436d27dd25c979b75499f9a91a94f0))
* refactor program service ([#388](https://github.com/ericssonbroadcastservices/javascript-player/issues/388)) ([cbc6664](https://github.com/ericssonbroadcastservices/javascript-player/commit/cbc66643c33b6b9711653de6a1d201e0adc5c224))


### Features

* **EMP-19286:** change subtitle toggle icon ([#393](https://github.com/ericssonbroadcastservices/javascript-player/issues/393)) ([fec2a69](https://github.com/ericssonbroadcastservices/javascript-player/commit/fec2a69008cb49ba855b65c5107eb81197524b50))



# [0.61.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.60.0...v0.61.0) (2023-01-27)


### Features

* **EMP-19213:** Add subtitle toggle ([#392](https://github.com/ericssonbroadcastservices/javascript-player/issues/392)) ([8c6b46a](https://github.com/ericssonbroadcastservices/javascript-player/commit/8c6b46a702a2f59d7500c89ce02175e5bc4a8d71))



# [0.60.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.59.7...v0.60.0) (2023-01-24)


### Features

* include dropped frames count in mux data plugin ([#386](https://github.com/ericssonbroadcastservices/javascript-player/issues/386)) ([f529d0c](https://github.com/ericssonbroadcastservices/javascript-player/commit/f529d0c93fa0bbd2b6d9c4f0adecf5a90610dd3c))



## [0.59.7](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.59.6...v0.59.7) (2023-01-23)



## [0.59.6](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.59.5...v0.59.6) (2023-01-20)


### Bug Fixes

* bump plugins package deps ([#382](https://github.com/ericssonbroadcastservices/javascript-player/issues/382)) ([b4343d3](https://github.com/ericssonbroadcastservices/javascript-player/commit/b4343d3e7cbe0743cf58575d936835c9771f2a4e))
* fix typo in shaka default configuration ([#381](https://github.com/ericssonbroadcastservices/javascript-player/issues/381)) ([310582a](https://github.com/ericssonbroadcastservices/javascript-player/commit/310582a911d0746bde05efe693f473de7b0482a5))



## [0.59.5](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.59.4...v0.59.5) (2023-01-12)


### Bug Fixes

* **cast:** properly check if text track includes language ([#376](https://github.com/ericssonbroadcastservices/javascript-player/issues/376)) ([8ace8b0](https://github.com/ericssonbroadcastservices/javascript-player/commit/8ace8b0d160ed2f26bd807c605a52df322419a1b))



## [0.59.4](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.59.3...v0.59.4) (2023-01-10)


### Bug Fixes

* **development:** include image assets in webpack build ([#371](https://github.com/ericssonbroadcastservices/javascript-player/issues/371)) ([a502273](https://github.com/ericssonbroadcastservices/javascript-player/commit/a502273e4981c2261be274472575519d4d1c8a5e))
* update `IInternalPlayerState` interface with correct types ([#373](https://github.com/ericssonbroadcastservices/javascript-player/issues/373)) ([3b0f2fb](https://github.com/ericssonbroadcastservices/javascript-player/commit/3b0f2fb2c74e0dec9422a123cba277770be27212))



## [0.59.3](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.59.2...v0.59.3) (2022-12-19)


### Bug Fixes

* hls subtitles kind ([#363](https://github.com/ericssonbroadcastservices/javascript-player/issues/363)) ([cb22751](https://github.com/ericssonbroadcastservices/javascript-player/commit/cb22751a4c222cc0884030d53aedbe5e02106f4e))



## [0.59.2](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.59.1...v0.59.2) (2022-12-19)


### Bug Fixes

* **cast:** check if text track includes language if not set media track label to "-" ([#359](https://github.com/ericssonbroadcastservices/javascript-player/issues/359)) ([2b082d1](https://github.com/ericssonbroadcastservices/javascript-player/commit/2b082d13ed95196b3f900a96d12a8c1b495efb6b))
* restore old shaka config ([#362](https://github.com/ericssonbroadcastservices/javascript-player/issues/362)) ([a60a12c](https://github.com/ericssonbroadcastservices/javascript-player/commit/a60a12ce5abe9658c5f915835eeccbcfc83c0eed))



## [0.59.1](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.59.0...v0.59.1) (2022-12-12)


### Bug Fixes

* add workaround for seeking bug on chromecast ([#355](https://github.com/ericssonbroadcastservices/javascript-player/issues/355)) ([4fae46a](https://github.com/ericssonbroadcastservices/javascript-player/commit/4fae46a98a43d21366ecae58ddfa5d2d07f2c36c))



# [0.59.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.58.0...v0.59.0) (2022-12-05)


### Bug Fixes

* always return the core methods in the Red Bee player ([#350](https://github.com/ericssonbroadcastservices/javascript-player/issues/350)) ([103edc9](https://github.com/ericssonbroadcastservices/javascript-player/commit/103edc95ac1905601813209a96597df626dda27a))
* **EMP-18663:** mislabeled error code(s) ([#344](https://github.com/ericssonbroadcastservices/javascript-player/issues/344)) ([b4f121e](https://github.com/ericssonbroadcastservices/javascript-player/commit/b4f121ea0feed63721b750cc7767a423004f7cf0))
* initialise dropped frames set to 0 ([#354](https://github.com/ericssonbroadcastservices/javascript-player/issues/354)) ([681148c](https://github.com/ericssonbroadcastservices/javascript-player/commit/681148c80b579f695d12156f5cda882de6b19b40))
* initialise logger before usage ([#351](https://github.com/ericssonbroadcastservices/javascript-player/issues/351)) ([58a52c2](https://github.com/ericssonbroadcastservices/javascript-player/commit/58a52c213e91fccaca896ab267ce96d9e38c75ea))
* read source from url on devpage ([#348](https://github.com/ericssonbroadcastservices/javascript-player/issues/348)) ([b8c976e](https://github.com/ericssonbroadcastservices/javascript-player/commit/b8c976ef030ceb2929b2dd32164a45c3cf1726f3))



# [0.58.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.57.0...v0.58.0) (2022-11-29)


### Bug Fixes

* do not clean branch of already existing files before push ([#335](https://github.com/ericssonbroadcastservices/javascript-player/issues/335)) ([78d1372](https://github.com/ericssonbroadcastservices/javascript-player/commit/78d1372613f64e65817193b65537ae608dea1390))
* **EMP-18979:** fix types / incorrect assumption for ads.stitcher ([#341](https://github.com/ericssonbroadcastservices/javascript-player/issues/341)) ([22c4531](https://github.com/ericssonbroadcastservices/javascript-player/commit/22c4531263b609a15aa12035b7b7181b696b74c0))
* refactor engine name/version. ([#337](https://github.com/ericssonbroadcastservices/javascript-player/issues/337)) ([2a947f2](https://github.com/ericssonbroadcastservices/javascript-player/commit/2a947f295499ba91b9f2499d54ff15a9dbf11302))
* set exposureBaseUrl when initialising a new PlayerCoreConnector ([#342](https://github.com/ericssonbroadcastservices/javascript-player/issues/342)) ([007e9be](https://github.com/ericssonbroadcastservices/javascript-player/commit/007e9be59e55c15441333e1f0c49b28fee8c9ec6))


### Features

* **EMP-18962:** Migrate from exposure api to eventsink ([#338](https://github.com/ericssonbroadcastservices/javascript-player/issues/338)) ([4a81f46](https://github.com/ericssonbroadcastservices/javascript-player/commit/4a81f46e7ab554d50f0793e0f780d40c4fcbe03f))



# [0.57.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.56.1...v0.57.0) (2022-11-15)


### Features

* prepare mux stream info ([#334](https://github.com/ericssonbroadcastservices/javascript-player/issues/334)) ([78cb02f](https://github.com/ericssonbroadcastservices/javascript-player/commit/78cb02f99533a719e74166471a5562fbe69caf68))



## [0.56.1](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.56.0...v0.56.1) (2022-11-15)


### Bug Fixes

* action to deploy dev-player to version folder ([#320](https://github.com/ericssonbroadcastservices/javascript-player/issues/320)) ([867c140](https://github.com/ericssonbroadcastservices/javascript-player/commit/867c14029f3450507c92ed9107b1486a8fde995f))
* bump Mux Data peerDependencies version ([#325](https://github.com/ericssonbroadcastservices/javascript-player/issues/325)) ([e89f4f6](https://github.com/ericssonbroadcastservices/javascript-player/commit/e89f4f6621042c6961961e9b5604d6c86ecc4caf))
* correctly handle seek event in Shaka on startup ([#331](https://github.com/ericssonbroadcastservices/javascript-player/issues/331)) ([7523eb9](https://github.com/ericssonbroadcastservices/javascript-player/commit/7523eb9709e83a957de6ca6748a619bf0be1e084))
* filter out metadata textTracks in `getSubtitleTracks` ([#327](https://github.com/ericssonbroadcastservices/javascript-player/issues/327)) ([933749e](https://github.com/ericssonbroadcastservices/javascript-player/commit/933749e1930fe8dfc92029eb65be7ef09eaed0c3))
* make it possible to override `AbstractBaseEngine` native events ([#317](https://github.com/ericssonbroadcastservices/javascript-player/issues/317)) ([75f35a2](https://github.com/ericssonbroadcastservices/javascript-player/commit/75f35a29ac2366fe0cd042133dcfa985fb4f0c5e)), closes [#322](https://github.com/ericssonbroadcastservices/javascript-player/issues/322)
* start listening for events before loading player ([#326](https://github.com/ericssonbroadcastservices/javascript-player/issues/326)) ([aecdd2c](https://github.com/ericssonbroadcastservices/javascript-player/commit/aecdd2c0f56c53cddc4aeb38373c09105c6a9d8f))
* update shaka default config ([#316](https://github.com/ericssonbroadcastservices/javascript-player/issues/316)) ([c3ae65c](https://github.com/ericssonbroadcastservices/javascript-player/commit/c3ae65c1c92e2657f46df89ae571542b73e62396))


### Features

* get stream metadata ([#328](https://github.com/ericssonbroadcastservices/javascript-player/issues/328)) ([da256e1](https://github.com/ericssonbroadcastservices/javascript-player/commit/da256e11910c7daec24aea9e2a75e8fbdf94f0a5))
* player init events ([#332](https://github.com/ericssonbroadcastservices/javascript-player/issues/332)) ([5116a6e](https://github.com/ericssonbroadcastservices/javascript-player/commit/5116a6e17863ba9880b73e621a9bf754d7ba6f08))



# [0.56.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.55.1...v0.56.0) (2022-11-07)


### Bug Fixes

* always use milliseconds when setting current time for Mux Data ([#315](https://github.com/ericssonbroadcastservices/javascript-player/issues/315)) ([d3e1fd0](https://github.com/ericssonbroadcastservices/javascript-player/commit/d3e1fd0e2d6416febb857e50e3d6e4028a898014))


### Features

* add load start event ([#318](https://github.com/ericssonbroadcastservices/javascript-player/issues/318)) ([2b51e72](https://github.com/ericssonbroadcastservices/javascript-player/commit/2b51e72d3b0e5a34bfb93a0d51429b564766ccff))



## [0.55.1](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.55.0...v0.55.1) (2022-10-28)


### Bug Fixes

* analytics player ready ([#309](https://github.com/ericssonbroadcastservices/javascript-player/issues/309)) ([8f42ef8](https://github.com/ericssonbroadcastservices/javascript-player/commit/8f42ef857cbd917674ff267d3e72e4aa45372b91))



# [0.55.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.54.5...v0.55.0) (2022-10-28)


### Features

* **EMP-18843:** Support custom Mux Data metadata fields ([#308](https://github.com/ericssonbroadcastservices/javascript-player/issues/308)) ([ca0e20c](https://github.com/ericssonbroadcastservices/javascript-player/commit/ca0e20c52ac21f5410f318a7703bba6b85d59a5d))



## [0.54.5](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.54.4...v0.54.5) (2022-10-26)


### Bug Fixes

* mux patches ([#306](https://github.com/ericssonbroadcastservices/javascript-player/issues/306)) ([6fa112c](https://github.com/ericssonbroadcastservices/javascript-player/commit/6fa112c57310a6886291328e82b92040c4f1e134))



## [0.54.4](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.54.3...v0.54.4) (2022-10-26)


### Bug Fixes

* add player as peer dep to mux plugin ([#305](https://github.com/ericssonbroadcastservices/javascript-player/issues/305)) ([35dccec](https://github.com/ericssonbroadcastservices/javascript-player/commit/35dccec1ff14831220b4073d411d65d51c3d087e))
* dynamically read video element in mux ([4d90cb4](https://github.com/ericssonbroadcastservices/javascript-player/commit/4d90cb42867ba18daceaff9c76a8febd3aaff7d4))



## [0.54.3](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.54.2...v0.54.3) (2022-10-26)


### Bug Fixes

* safety check in mux plugin ([ec8f3bb](https://github.com/ericssonbroadcastservices/javascript-player/commit/ec8f3bbb145693612c61ec2b87cbfd9f5287e52f))



## [0.54.2](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.54.1...v0.54.2) (2022-10-26)



## [0.54.1](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.54.0...v0.54.1) (2022-10-25)



# [0.54.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.53.1...v0.54.0) (2022-10-25)


### Bug Fixes

* include js-player-plugins in development package ([36e4fb0](https://github.com/ericssonbroadcastservices/javascript-player/commit/36e4fb04935e9006ac7f928aebd78c588bea9e90))


### Features

* add qr code to dev page ([#300](https://github.com/ericssonbroadcastservices/javascript-player/issues/300)) ([b415149](https://github.com/ericssonbroadcastservices/javascript-player/commit/b41514922c0f08173f63d3314b99e80a0b0ac562))



## [0.53.1](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.53.0...v0.53.1) (2022-10-19)


### Bug Fixes

* copy missing style.css when deploying dev page ([d78c7df](https://github.com/ericssonbroadcastservices/javascript-player/commit/d78c7dfa12e04b9da79ab75e97800df6037dd3d8))
* **EMP-18653:** Ads can be skipped on safari iOS 16 ([#292](https://github.com/ericssonbroadcastservices/javascript-player/issues/292)) ([b835530](https://github.com/ericssonbroadcastservices/javascript-player/commit/b835530aaede3fc0dc333053fdb22e762bc28f19))
* Update selected audio track when switching audio track ([#297](https://github.com/ericssonbroadcastservices/javascript-player/issues/297)) ([08f340a](https://github.com/ericssonbroadcastservices/javascript-player/commit/08f340a1451089c6d86e6d3bfd6064ce1e5ff0c7))



# [0.53.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.52.0...v0.53.0) (2022-10-17)


### Bug Fixes

* **EMP-18754:** set subtitle depending on language and kind ([#294](https://github.com/ericssonbroadcastservices/javascript-player/issues/294)) ([d52ae33](https://github.com/ericssonbroadcastservices/javascript-player/commit/d52ae33db3b384073e70ebca479ebb606476f2a6))
* **EMP-18782:** auto selecting subtitles not working in hls.js ([#295](https://github.com/ericssonbroadcastservices/javascript-player/issues/295)) ([d636daa](https://github.com/ericssonbroadcastservices/javascript-player/commit/d636daa2dc6bc1c26d9e268815afa1ee6108251a))
* use npx for running webpack in workflow ([d77d247](https://github.com/ericssonbroadcastservices/javascript-player/commit/d77d247476f4df47009d7019a13815be255be924))


### Features

* **EMP-18405:** subtitle positioning support and Shaka color fix ([#288](https://github.com/ericssonbroadcastservices/javascript-player/issues/288)) ([df4c698](https://github.com/ericssonbroadcastservices/javascript-player/commit/df4c6981455ba1b672cc8677545137a60b666c3d)), closes [#279](https://github.com/ericssonbroadcastservices/javascript-player/issues/279)



# [0.52.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.51.1...v0.52.0) (2022-09-21)


### Features

* **EMP-18648:** Seek to wall clock time given as UTC timestamp ([#287](https://github.com/ericssonbroadcastservices/javascript-player/issues/287)) ([b5df6d5](https://github.com/ericssonbroadcastservices/javascript-player/commit/b5df6d500ea3a1d913c12b0d1d454a7f25717063))



## [0.51.1](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.51.0...v0.51.1) (2022-09-16)


### Bug Fixes

* check for metadataURIs in initOptions and not options ([#285](https://github.com/ericssonbroadcastservices/javascript-player/issues/285)) ([1b5ffd3](https://github.com/ericssonbroadcastservices/javascript-player/commit/1b5ffd3d9ac3303956f7d635bd08a4d0e9a7153c))



# [0.51.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.50.2...v0.51.0) (2022-09-13)


### Bug Fixes

* **EMP-18285:** Set heartbeat depending on `analyticsPostInterval` ([#280](https://github.com/ericssonbroadcastservices/javascript-player/issues/280)) ([f284521](https://github.com/ericssonbroadcastservices/javascript-player/commit/f284521d9545b4cf6ffc5acb08d0323a941cc326))


### Features

* timed metadata ([#282](https://github.com/ericssonbroadcastservices/javascript-player/issues/282)) ([f4226d2](https://github.com/ericssonbroadcastservices/javascript-player/commit/f4226d29636be30a9b00024e0f2a0325ec69a54a))



## [0.50.2](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.50.1...v0.50.2) (2022-09-08)


### Bug Fixes

* use preload auto on firefox in native engine ([#284](https://github.com/ericssonbroadcastservices/javascript-player/issues/284)) ([496b62b](https://github.com/ericssonbroadcastservices/javascript-player/commit/496b62b5f36e59384df7dda148c71ae3b373b3ff))



## [0.50.1](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.50.0...v0.50.1) (2022-09-06)


### Bug Fixes

* only do hls parsing on hls manifests ([#283](https://github.com/ericssonbroadcastservices/javascript-player/issues/283)) ([9a8f69c](https://github.com/ericssonbroadcastservices/javascript-player/commit/9a8f69c132c1b0903c28beaffe156ab0109a03e9))



# [0.50.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.49.5...v0.50.0) (2022-08-22)


### Features

* use latest version of Shaka Player ([#276](https://github.com/ericssonbroadcastservices/javascript-player/issues/276)) ([24c85af](https://github.com/ericssonbroadcastservices/javascript-player/commit/24c85afbde632e1000162f29e2cc254b93f32b0e))



## [0.49.5](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.49.4...v0.49.5) (2022-08-11)


### Bug Fixes

* **EMP-18422/EMP-17462:** hide subtitles when turned off ([#275](https://github.com/ericssonbroadcastservices/javascript-player/issues/275)) ([9547abd](https://github.com/ericssonbroadcastservices/javascript-player/commit/9547abda10b2a8c27a50321a92b46855356f080d))



## [0.49.4](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.49.3...v0.49.4) (2022-08-02)


### Bug Fixes

* **EMP-18256:** use `display: inline-block` for ad index label ([#274](https://github.com/ericssonbroadcastservices/javascript-player/issues/274)) ([28414c0](https://github.com/ericssonbroadcastservices/javascript-player/commit/28414c0d61d77311142376b505fc031af2d7885c))



## [0.49.3](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.49.2...v0.49.3) (2022-07-05)



## [0.49.2](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.49.1...v0.49.2) (2022-06-28)



## [0.49.1](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.49.0...v0.49.1) (2022-06-27)


### Bug Fixes

* adjust mindvr window ([#270](https://github.com/ericssonbroadcastservices/javascript-player/issues/270)) ([0c607f0](https://github.com/ericssonbroadcastservices/javascript-player/commit/0c607f036ccda4bea9a78d570b7980f911d44aee))
* **EMP-18364:** use dashjs for adinsertionplayer ([#271](https://github.com/ericssonbroadcastservices/javascript-player/issues/271)) ([3f6e765](https://github.com/ericssonbroadcastservices/javascript-player/commit/3f6e765fc9a8d6414bf280a5f20b8636cf97f0aa))



# [0.49.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.48.0...v0.49.0) (2022-06-22)


### Features

* **EMP-18224:** SSAI Support on LG 2017-2019 ([#268](https://github.com/ericssonbroadcastservices/javascript-player/issues/268)) ([0adce0a](https://github.com/ericssonbroadcastservices/javascript-player/commit/0adce0ac13b3b968716d90d6165420c863458b0d))



# [0.48.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.47.1...v0.48.0) (2022-06-13)


### Bug Fixes

* **EMP-18284:** hls.js displays native subtitles ([#267](https://github.com/ericssonbroadcastservices/javascript-player/issues/267)) ([4325a20](https://github.com/ericssonbroadcastservices/javascript-player/commit/4325a20e90b162f0f32e23e927d6f0ac12fd1ddc))


### Features

* **EMP-18313:** send locale to cast ([#269](https://github.com/ericssonbroadcastservices/javascript-player/issues/269)) ([863b76c](https://github.com/ericssonbroadcastservices/javascript-player/commit/863b76c5d1e1807b1fbf415c7272a38609ed776b))



## [0.47.1](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.47.0...v0.47.1) (2022-06-07)


### Bug Fixes

* add offset to scrubbed to event ([#266](https://github.com/ericssonbroadcastservices/javascript-player/issues/266)) ([ea744b0](https://github.com/ericssonbroadcastservices/javascript-player/commit/ea744b0560d23a5970937d971dfdff50a9f2cc2e))
* core css not included in player package ([d7b7f14](https://github.com/ericssonbroadcastservices/javascript-player/commit/d7b7f14e1125276699067235a3cf2a3abf67ec78))



# [0.47.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.46.0...v0.47.0) (2022-05-23)


### Features

* add meterialProfile to play call ([#264](https://github.com/ericssonbroadcastservices/javascript-player/issues/264)) ([843a024](https://github.com/ericssonbroadcastservices/javascript-player/commit/843a0244c4569e090bf8c02d47c462aad8172529))



# [0.46.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.45.0...v0.46.0) (2022-05-13)


### Bug Fixes

* align ad counter with other platforms ([3bbe670](https://github.com/ericssonbroadcastservices/javascript-player/commit/3bbe6701473fb6dbed1c36a2f94a32cf2553dcc2))
* use explicit line height for subtitles ([#262](https://github.com/ericssonbroadcastservices/javascript-player/issues/262)) ([4363450](https://github.com/ericssonbroadcastservices/javascript-player/commit/43634503e90e3443a4d77324272324a0212e3fc7))


### Features

* support custom ad parameters to be sent to play call ([#263](https://github.com/ericssonbroadcastservices/javascript-player/issues/263)) ([8348cbd](https://github.com/ericssonbroadcastservices/javascript-player/commit/8348cbd20e5561fc4a24be5b070dda5a75bfc385))



# [0.45.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.44.2...v0.45.0) (2022-05-10)


### Features

* full player area ad clickthrough ([#258](https://github.com/ericssonbroadcastservices/javascript-player/issues/258)) ([3ec7c70](https://github.com/ericssonbroadcastservices/javascript-player/commit/3ec7c70f7b2a45f1e7de206fe0c34d33303c011a))



## [0.44.2](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.44.1...v0.44.2) (2022-05-09)


### Bug Fixes

* **core:** subtitles tiny on lg ([#261](https://github.com/ericssonbroadcastservices/javascript-player/issues/261)) ([9a2214e](https://github.com/ericssonbroadcastservices/javascript-player/commit/9a2214eee0a07008b414df5e71491087e5cd024a))



## [0.44.1](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.44.0...v0.44.1) (2022-05-09)


### Bug Fixes

* **core:** subtitles are rendered without line-breaks ([#260](https://github.com/ericssonbroadcastservices/javascript-player/issues/260)) ([c123521](https://github.com/ericssonbroadcastservices/javascript-player/commit/c12352101d2c0ae22a568cb67c7fdc806df3f999))



# [0.44.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.43.5...v0.44.0) (2022-05-09)


### Bug Fixes

* **EMP-17984:** 4K material crashing certain LG devices ([#259](https://github.com/ericssonbroadcastservices/javascript-player/issues/259)) ([857aec6](https://github.com/ericssonbroadcastservices/javascript-player/commit/857aec6fddf0025d56fe9530df104659ec1a2a07))


### Features

* ad countdown ([#257](https://github.com/ericssonbroadcastservices/javascript-player/issues/257)) ([4f6767e](https://github.com/ericssonbroadcastservices/javascript-player/commit/4f6767e0c296e7732b4c9fccad2001a4e033ae32))



## [0.43.5](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.43.4...v0.43.5) (2022-05-05)


### Bug Fixes

* sync packages ([8b4fcd1](https://github.com/ericssonbroadcastservices/javascript-player/commit/8b4fcd14f6cc43b2132296bfcc9ef709dccabcb9))
* updated dependencies ([e4ae5bc](https://github.com/ericssonbroadcastservices/javascript-player/commit/e4ae5bcf60c5537ea164b4dd9329c2f22ee5091e))



## [0.43.4](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.43.3...v0.43.4) (2022-05-05)


### Bug Fixes

* **adMonitor:** all impressions aren't sent ([#254](https://github.com/ericssonbroadcastservices/javascript-player/issues/254)) ([8a8d481](https://github.com/ericssonbroadcastservices/javascript-player/commit/8a8d481d17bb08b00c9a255cc4a9bd03cf3f1c07))
* **analytics:** CastConnectors sends in bps instead of kbps when bit ([#255](https://github.com/ericssonbroadcastservices/javascript-player/issues/255)) ([bfb2ce7](https://github.com/ericssonbroadcastservices/javascript-player/commit/bfb2ce7025ca9145e04346fd52c19fe5df84bc10))
* bump sdk to remove maxlength on description ([5469f2b](https://github.com/ericssonbroadcastservices/javascript-player/commit/5469f2b6af990836026ed32b2cda9bbceef103bb))
* initial analytics dispatch ([#256](https://github.com/ericssonbroadcastservices/javascript-player/issues/256)) ([1b7e9fd](https://github.com/ericssonbroadcastservices/javascript-player/commit/1b7e9fd660fc9086aeae2f668d29e629444afe99))



## [0.43.3](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.43.2...v0.43.3) (2022-04-19)


### Bug Fixes

* live ssai infinite bufferings after a few seconds ([#253](https://github.com/ericssonbroadcastservices/javascript-player/issues/253)) ([25cd3ff](https://github.com/ericssonbroadcastservices/javascript-player/commit/25cd3ff55113b9a6dd77ee8c6221d6f2d71d9fe6))



## [0.43.2](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.43.1...v0.43.2) (2022-03-29)


### Bug Fixes

* switching XMLHttpRequest to fetch for fairplay license impl ([#251](https://github.com/ericssonbroadcastservices/javascript-player/issues/251)) ([56cc00b](https://github.com/ericssonbroadcastservices/javascript-player/commit/56cc00b5b235e7f9c7acede56c62c6bc4d6181af))
* updated hls.js ([#252](https://github.com/ericssonbroadcastservices/javascript-player/issues/252)) ([9697abd](https://github.com/ericssonbroadcastservices/javascript-player/commit/9697abd7a2fbbc18403015cb19c8bb494d46cfd5))



## [0.43.1](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.43.0...v0.43.1) (2022-03-29)


### Bug Fixes

* subtitles cover screen on mobile ([#250](https://github.com/ericssonbroadcastservices/javascript-player/issues/250)) ([5226843](https://github.com/ericssonbroadcastservices/javascript-player/commit/5226843baee884939071ebaadb17eafe136d0533))



# [0.43.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.42.0...v0.43.0) (2022-03-24)


### Bug Fixes

* null check analytics options before reaching app name ([#249](https://github.com/ericssonbroadcastservices/javascript-player/issues/249)) ([6253670](https://github.com/ericssonbroadcastservices/javascript-player/commit/6253670cafb00844bfb8c3078feeb4967187245c))


### Features

* **EMP-17536:** render subtitles in the DOM ([#248](https://github.com/ericssonbroadcastservices/javascript-player/issues/248)) ([70cfdde](https://github.com/ericssonbroadcastservices/javascript-player/commit/70cfdde4b0f38371a2aef184ec4d1f9f211599e7))



# [0.42.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.41.4...v0.42.0) (2022-03-22)


### Bug Fixes

* analytics heartbeat fixes ([7069dee](https://github.com/ericssonbroadcastservices/javascript-player/commit/7069dee1017f5f4d1d4a275d6777a047f7dd5bef))
* hardening to event pool dispatch on page close ([#245](https://github.com/ericssonbroadcastservices/javascript-player/issues/245)) ([5294d42](https://github.com/ericssonbroadcastservices/javascript-player/commit/5294d4253a9d93c6bca3d21eb6eec58001daf1c7))
* use duration in milliseconds for bookmarks check ([#246](https://github.com/ericssonbroadcastservices/javascript-player/issues/246)) ([dea40d3](https://github.com/ericssonbroadcastservices/javascript-player/commit/dea40d35848507933f99935f8496bb4b98c0ecbc))


### Features

* added richer app data to analytics payload ([#247](https://github.com/ericssonbroadcastservices/javascript-player/issues/247)) ([9ff2e92](https://github.com/ericssonbroadcastservices/javascript-player/commit/9ff2e9262751efdba961a9f03d100f2b54824763))



## [0.41.4](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.41.3...v0.41.4) (2022-03-03)


### Bug Fixes

* audio only check failed playing external source ([#244](https://github.com/ericssonbroadcastservices/javascript-player/issues/244)) ([ec5c1b9](https://github.com/ericssonbroadcastservices/javascript-player/commit/ec5c1b9004b045fe5fdd9cdad47532db256e0750))



## [0.41.3](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.41.2...v0.41.3) (2022-02-28)


### Bug Fixes

* include proper files in vtt parser package ([55cc808](https://github.com/ericssonbroadcastservices/javascript-player/commit/55cc808737d89cf1a2ade02d5fe493e1c56df61c))



## [0.41.2](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.41.1...v0.41.2) (2022-02-28)


### Features

* add sprite vtt parser as separate package ([#243](https://github.com/ericssonbroadcastservices/javascript-player/issues/243)) ([579cffa](https://github.com/ericssonbroadcastservices/javascript-player/commit/579cffa1863539e120fd9c2fdcfc46b45d5c2141))



## [0.41.1](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.41.0...v0.41.1) (2022-02-25)


### Bug Fixes

* bump sdk version to fix typo in export ([#242](https://github.com/ericssonbroadcastservices/javascript-player/issues/242)) ([73b2bcc](https://github.com/ericssonbroadcastservices/javascript-player/commit/73b2bcc555c89b8c7c3adb7ece076b43b7d19c8e))
* updated analytics to include app type ([#241](https://github.com/ericssonbroadcastservices/javascript-player/issues/241)) ([815f6e5](https://github.com/ericssonbroadcastservices/javascript-player/commit/815f6e557d4deddce206c2c50757d23763eb9ac3))



# [0.41.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.40.1...v0.41.0) (2022-02-22)


### Bug Fixes

* pause ad stream on visibility hidden ([#240](https://github.com/ericssonbroadcastservices/javascript-player/issues/240)) ([db276f7](https://github.com/ericssonbroadcastservices/javascript-player/commit/db276f7f687a0a17c3e9a4beada47695c18b890e))
* reset playbackrate during ads ([#239](https://github.com/ericssonbroadcastservices/javascript-player/issues/239)) ([ec5503e](https://github.com/ericssonbroadcastservices/javascript-player/commit/ec5503e4857e25c5650418a9fd303fc1669f7e00))
* ssai added tracking for loaded and start ([#238](https://github.com/ericssonbroadcastservices/javascript-player/issues/238)) ([d9b8c7e](https://github.com/ericssonbroadcastservices/javascript-player/commit/d9b8c7e7cad14d37903e13787ab372ef168d5864))
* typescript signatures to signal null as valid data in subtitle methods ([#237](https://github.com/ericssonbroadcastservices/javascript-player/issues/237)) ([d33fab3](https://github.com/ericssonbroadcastservices/javascript-player/commit/d33fab3d15888bfc82d05e84025d7f82395802e1))


### Features

* maxresolution as init option to send along the play call ([#235](https://github.com/ericssonbroadcastservices/javascript-player/issues/235)) ([d4445f2](https://github.com/ericssonbroadcastservices/javascript-player/commit/d4445f26c72ea1814c05f03b226e09275b0713c9))
* support for custom engine configuration ([#236](https://github.com/ericssonbroadcastservices/javascript-player/issues/236)) ([ed0b7a0](https://github.com/ericssonbroadcastservices/javascript-player/commit/ed0b7a0ec10713ba98956f1f0514413f77b6601e))



## [0.40.1](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.40.0...v0.40.1) (2022-01-27)


### Bug Fixes

* use default presentation delay ([#232](https://github.com/ericssonbroadcastservices/javascript-player/issues/232)) ([3aea9d3](https://github.com/ericssonbroadcastservices/javascript-player/commit/3aea9d3743036491ab99676605d7b2265e608bf4))



# [0.40.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.39.0...v0.40.0) (2022-01-19)


### Features

* **EMP-17537:** improve subtitle rendering ([#231](https://github.com/ericssonbroadcastservices/javascript-player/issues/231)) ([1a2483f](https://github.com/ericssonbroadcastservices/javascript-player/commit/1a2483f5d327521d6ec98962b464a846016d675e))
* exposing media type in player state ([#228](https://github.com/ericssonbroadcastservices/javascript-player/issues/228)) ([a07a59f](https://github.com/ericssonbroadcastservices/javascript-player/commit/a07a59f78f09c4bd6f19b225eeb2e00600c1d56b))
* usage of hls.js for live delay support on hls live streams ([#227](https://github.com/ericssonbroadcastservices/javascript-player/issues/227)) ([9e6542c](https://github.com/ericssonbroadcastservices/javascript-player/commit/9e6542cf10eca0560a6896ac88b1914a092a2036))



# [0.39.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.38.3...v0.39.0) (2021-12-21)


### Bug Fixes

* live delay was never set due to failing if statement ([f45107e](https://github.com/ericssonbroadcastservices/javascript-player/commit/f45107e6dfbf1f09ea32dd23fc0cba0ef671369a))


### Features

* report manual bitrate changes to analytics ([#225](https://github.com/ericssonbroadcastservices/javascript-player/issues/225)) ([e489282](https://github.com/ericssonbroadcastservices/javascript-player/commit/e489282eb229b319f1a7b677abf6ff5df2cd71d4))



## [0.38.3](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.38.2...v0.38.3) (2021-12-15)


### Bug Fixes

* bitrate change wasn't triggered when start time was 0 ([#224](https://github.com/ericssonbroadcastservices/javascript-player/issues/224)) ([3bf674a](https://github.com/ericssonbroadcastservices/javascript-player/commit/3bf674a04a77c1340b7eafe05546e56905cb6069))



## [0.38.2](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.38.1...v0.38.2) (2021-12-14)


### Bug Fixes

* regression with eventsink url path being overwritten ([#222](https://github.com/ericssonbroadcastservices/javascript-player/issues/222)) ([de52e22](https://github.com/ericssonbroadcastservices/javascript-player/commit/de52e226bba155e5bf5fbc3bc29ff75792474480))



## [0.38.1](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.38.0...v0.38.1) (2021-12-10)


### Bug Fixes

* **analytics:** improve clenaup of cast connector ([#221](https://github.com/ericssonbroadcastservices/javascript-player/issues/221)) ([73ed8b9](https://github.com/ericssonbroadcastservices/javascript-player/commit/73ed8b98ca748fdc01a036d02d48f641df56d672))



# [0.38.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.37.9...v0.38.0) (2021-12-07)


### Features

* support for clickthrough on ads ([#220](https://github.com/ericssonbroadcastservices/javascript-player/issues/220)) ([4f6614a](https://github.com/ericssonbroadcastservices/javascript-player/commit/4f6614aad94b47f5e1403bd363fa72878a23ab67))



## [0.37.9](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.37.8...v0.37.9) (2021-12-01)


### Bug Fixes

* add missing error message to cast errors ([4f073d3](https://github.com/ericssonbroadcastservices/javascript-player/commit/4f073d31b8036bed8085e3f61f1fcda81685a8aa))



## [0.37.8](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.37.7...v0.37.8) (2021-11-04)


### Bug Fixes

* broken package-locks ([1921f78](https://github.com/ericssonbroadcastservices/javascript-player/commit/1921f785ad95b09efe2774f93733cf8e37fcff90))
* don't disable heartBeat onPause() ([24ae678](https://github.com/ericssonbroadcastservices/javascript-player/commit/24ae678778eeb25aedd01e5d940afae375792a82))
* remove comment ([3a55352](https://github.com/ericssonbroadcastservices/javascript-player/commit/3a5535235b3e9c5781e04977571a58cd5cb861d2))



## [0.37.7](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.37.6...v0.37.7) (2021-10-18)


### Bug Fixes

* broken vast parsing ([#218](https://github.com/ericssonbroadcastservices/javascript-player/issues/218)) ([dbeb6fb](https://github.com/ericssonbroadcastservices/javascript-player/commit/dbeb6fbc015cd38e682252fb2a7cfe7fb959f078))



## [0.37.6](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.37.5...v0.37.6) (2021-10-14)


### Bug Fixes

* multi-period dash not playing if startTime is too close to new period ([#217](https://github.com/ericssonbroadcastservices/javascript-player/issues/217)) ([a447aaa](https://github.com/ericssonbroadcastservices/javascript-player/commit/a447aaaabbd3f17e6a4e64cadf27d5981191f270))



## [0.37.5](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.37.4...v0.37.5) (2021-10-12)


### Bug Fixes

* wrong versions marked in package.json ([37af630](https://github.com/ericssonbroadcastservices/javascript-player/commit/37af630428c1ea1ba8b7e4d4581411eb3c7fcd72))



## [0.37.4](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.37.3...v0.37.4) (2021-10-11)


### Bug Fixes

* bump can-autoplay to fix memory leak ([0277aaf](https://github.com/ericssonbroadcastservices/javascript-player/commit/0277aafb90f02c12b86c95cfc79d8867c3e8ccaf))
* dashjs not playing smoothstreaming from source ([86116d4](https://github.com/ericssonbroadcastservices/javascript-player/commit/86116d4dd6613f0b3b59068c73e3330a385984cd))
* just show marker points menu when applicable types is set ([#216](https://github.com/ericssonbroadcastservices/javascript-player/issues/216)) ([f0b7c41](https://github.com/ericssonbroadcastservices/javascript-player/commit/f0b7c416d9b3d13c996fc705db898556e69b1cbb))



## [0.37.3](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.37.2...v0.37.3) (2021-10-07)


### Bug Fixes

* cast session being broken if not stopping session completely ([213c273](https://github.com/ericssonbroadcastservices/javascript-player/commit/213c273dfbaf8f8459f37a0b81bf4ae2ffd9759c))



## [0.37.2](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.37.1...v0.37.2) (2021-10-07)


### Bug Fixes

* cast controls crashing due to type error ([3f2c399](https://github.com/ericssonbroadcastservices/javascript-player/commit/3f2c399fc7391fd9744b79cc75c3b6d38b5e6b7e))



## [0.37.1](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.37.0...v0.37.1) (2021-10-06)


### Bug Fixes

* **analytics:** null references ([f20bbef](https://github.com/ericssonbroadcastservices/javascript-player/commit/f20bbeff3893fb2a63011f2ab92aa2443ae0ebaa))



# [0.37.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.36.2...v0.37.0) (2021-10-06)


### Bug Fixes

* comment on config ([b4f886f](https://github.com/ericssonbroadcastservices/javascript-player/commit/b4f886fb44150c83665b897870a2caf2d85d9a82))
* sort quality levels exposed in state ([dbb6748](https://github.com/ericssonbroadcastservices/javascript-player/commit/dbb6748892c91705ef07d224f23c629c8383e4ec))
* subtitles not selectable for multi-period dash ([#215](https://github.com/ericssonbroadcastservices/javascript-player/issues/215)) ([12a10e3](https://github.com/ericssonbroadcastservices/javascript-player/commit/12a10e3c0267ca2ba07ca03b2f626cded220baf6))
* type error ([76d7de2](https://github.com/ericssonbroadcastservices/javascript-player/commit/76d7de2686f93011a27234fd66313bf618a4d54b))


### Features

* **EMP-16025:** remove init call & fix broken analytics cleanup ([#214](https://github.com/ericssonbroadcastservices/javascript-player/issues/214)) ([6f19cba](https://github.com/ericssonbroadcastservices/javascript-player/commit/6f19cbab16afd945b7303312ae7479808adecffb))
* export `IPlayerState` ([#213](https://github.com/ericssonbroadcastservices/javascript-player/issues/213)) ([a232609](https://github.com/ericssonbroadcastservices/javascript-player/commit/a23260945f29e042c339d87e884df6bfff354194))
* subtitle color support ([#212](https://github.com/ericssonbroadcastservices/javascript-player/issues/212)) ([0cb5862](https://github.com/ericssonbroadcastservices/javascript-player/commit/0cb5862b4462d1a7fb3a08b58a2d7bd85991042d))



## [0.36.2](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.36.1...v0.36.2) (2021-09-27)


### Bug Fixes

* null check for asset metadata before trying to get markers ([ef8dfe9](https://github.com/ericssonbroadcastservices/javascript-player/commit/ef8dfe9d73539a98b6b395d9f73e6ca94ef5355d))



## [0.36.1](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.36.0...v0.36.1) (2021-09-23)


### Bug Fixes

* huge subtitles in chrome ([#209](https://github.com/ericssonbroadcastservices/javascript-player/issues/209)) ([7314040](https://github.com/ericssonbroadcastservices/javascript-player/commit/73140409d75aa5d0d8d796b0a8bb5c28320d79ef))



# [0.36.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.35.0...v0.36.0) (2021-09-22)


### Bug Fixes

* amend PR-comments ([214dd18](https://github.com/ericssonbroadcastservices/javascript-player/commit/214dd18cfde57588c149ec6ca2991c2ae28ef72a))
* build not working ([aa097b4](https://github.com/ericssonbroadcastservices/javascript-player/commit/aa097b41f9bbd135d987ff98fc1b9f4e3448c1ac))
* fixed typo ([82110fa](https://github.com/ericssonbroadcastservices/javascript-player/commit/82110fa5e8ab8bac05204bc2a9f6b4b9687c0448))
* fixup! remove mute on start ([11ea14b](https://github.com/ericssonbroadcastservices/javascript-player/commit/11ea14b88f5fbba8ecc3cad48830e41585740815))
* fixup! rename components related to contentMarkers from cuePoints to contentMarkers ([76be1fb](https://github.com/ericssonbroadcastservices/javascript-player/commit/76be1fbaad6afc8736bdcfee7857febfddf8f783))
* remove end time from contentmarkers to align look on contentmarkermenu ([6563e64](https://github.com/ericssonbroadcastservices/javascript-player/commit/6563e649d66133d36b511c6eaeba30c6e49435fd))
* remove onHover events on menu buttons ([e7a065e](https://github.com/ericssonbroadcastservices/javascript-player/commit/e7a065e7f4e31eb0c00809ff62a8a22b24a2c624))
* remove unused file waitForAnimationToFinish ([96c96c0](https://github.com/ericssonbroadcastservices/javascript-player/commit/96c96c0f5231a73baf397604aca7fa95499b8ac1))
* rename useAnimation to useWaitForAnimationToFinish ([c010fc0](https://github.com/ericssonbroadcastservices/javascript-player/commit/c010fc0444232f0b93942fa209079404606d0c90))
* set contentMarkers in AssetPlayer ([29e97fd](https://github.com/ericssonbroadcastservices/javascript-player/commit/29e97fd851b15271ea5e255a8fdc084bfa15f687))
* set initital visible state to false ([1567420](https://github.com/ericssonbroadcastservices/javascript-player/commit/15674200366a9cc30de2c5fdd2100170c7427896))


### Features

* add checkifActiveplayer event and emit on event start and event end ([802c11d](https://github.com/ericssonbroadcastservices/javascript-player/commit/802c11d6342955912a1a2aeb0828d4d0a4912ed8))
* add constant isMobile in playerSkin ([2d89b39](https://github.com/ericssonbroadcastservices/javascript-player/commit/2d89b397943cd3e55b3815c0ed838eee2eb18658))
* add cuepoint menu with seekTo function. ([4223180](https://github.com/ericssonbroadcastservices/javascript-player/commit/4223180b60d05cc7ec6c21b5534de7bb6df27597))
* add handler for multiple intros and credits ([10b1025](https://github.com/ericssonbroadcastservices/javascript-player/commit/10b1025224cf661a4a0ca4d3da7fb52db50f2595))
* add isMobile-check to set fontsize on skipbutton ([41cf7de](https://github.com/ericssonbroadcastservices/javascript-player/commit/41cf7de4a685a421c10e3c82fc3b29495c9eeaa0))
* add material Icons ([be84dd7](https://github.com/ericssonbroadcastservices/javascript-player/commit/be84dd7ed02ee7d0fb8a7f0a64301419f48f7e37))
* add minor css-changes ([0c6290e](https://github.com/ericssonbroadcastservices/javascript-player/commit/0c6290ec7bdb5fc2fbb3539929cd5a9fc717cd41))
* add more icons, update css and refactor cuePointMenu ([ef5d04a](https://github.com/ericssonbroadcastservices/javascript-player/commit/ef5d04af6df7b0b64d51f85840ce059dbb6d47df))
* add notes on nicetimeformat function ([2376c67](https://github.com/ericssonbroadcastservices/javascript-player/commit/2376c67ffb2105055f9a38d7ff160464733cb18c))
* add statehandler, add on hover popup ([5db49c6](https://github.com/ericssonbroadcastservices/javascript-player/commit/5db49c6516c5228287d3ba1145bb4e4429ab3f42))
* add toggle on menu buttons click ([b2b136c](https://github.com/ericssonbroadcastservices/javascript-player/commit/b2b136c95f7f5cb0fbc82f5458a1e4fda151bada))
* add transition in and out of skipsegment button ([66e920a](https://github.com/ericssonbroadcastservices/javascript-player/commit/66e920a6698f240c1ffcbad44f3f10d28c8ccc7e))
* add transitions when toggling between menus ([fe550d8](https://github.com/ericssonbroadcastservices/javascript-player/commit/fe550d88c0f9e3fc156310f0cec855de75645603))
* add useAnimate hook for smoother transitions between menus ([fcda61a](https://github.com/ericssonbroadcastservices/javascript-player/commit/fcda61af6cf3f395c471b3453ffd74ceb21dd6da))
* add working seek from mobile skin ([422ced3](https://github.com/ericssonbroadcastservices/javascript-player/commit/422ced36cdb38b6d07d2eb80abb088cbd153fb6a))
* animate between screens with css without animation hook ([4d3db77](https://github.com/ericssonbroadcastservices/javascript-player/commit/4d3db771b831a90bfdd6c64e77f43a53507e5027))
* create cuePoints button ([b6b897f](https://github.com/ericssonbroadcastservices/javascript-player/commit/b6b897fa4e9d816979959620e63626fc932a1f85))
* dont show contentmarkers if list is empty ([b636057](https://github.com/ericssonbroadcastservices/javascript-player/commit/b636057d34e43c46df9f2a7d51df3f51c7f9f958))
* fixup! seek to chapter endoffset in seconds ([fe8080f](https://github.com/ericssonbroadcastservices/javascript-player/commit/fe8080fa07aee8a4d419321a795198776c8cc6e0))
* hide skin on mobile when browsing cuepoints ([09cc3b3](https://github.com/ericssonbroadcastservices/javascript-player/commit/09cc3b3a06f16ff538e79ef263f27c387b5adf7a))
* hide skip button after twice the time of hidecontrols, defaults to 4seconds ([88e544c](https://github.com/ericssonbroadcastservices/javascript-player/commit/88e544cffc15fc839df1e55364ece433061abefb))
* listen only to activeIntros since we're  only using that type in the skin ([99879fb](https://github.com/ericssonbroadcastservices/javascript-player/commit/99879fb0df86398375933d965d3d553787d6b4fa))
* make that only intros are skippable ([ab9fd6d](https://github.com/ericssonbroadcastservices/javascript-player/commit/ab9fd6d70107c71ed3e46f8881bfd3ad9134852b))
* move activeContentMarker into metadata state ([ca8add5](https://github.com/ericssonbroadcastservices/javascript-player/commit/ca8add5823422d4a52535574d648c1fd42bd7f9f))
* move contentMarker check into own method. ([9c444e2](https://github.com/ericssonbroadcastservices/javascript-player/commit/9c444e2a1a88606331ab1b6d25b217314953c9a9))
* move VIEW_TYPE enum to skin constants.ts ([b8bffbd](https://github.com/ericssonbroadcastservices/javascript-player/commit/b8bffbde33d5ec0653ba6a5260ebfa4bcac7dac6))
* only render cuepoint menu if cuepoints exists ([e65de5b](https://github.com/ericssonbroadcastservices/javascript-player/commit/e65de5be772548ecf1634e9d845e3da2c7a68ac2))
* prolong time of skip visibility after user is deemed inactive ([0c64206](https://github.com/ericssonbroadcastservices/javascript-player/commit/0c642068e65a8eb37ccccc1e1e4377c181e03866))
* refactor onclick  code ([f36d535](https://github.com/ericssonbroadcastservices/javascript-player/commit/f36d535646ff4b8d5ee4fabacf96b15251433bc0))
* refactor reading of intro and credits markers ([ec78f22](https://github.com/ericssonbroadcastservices/javascript-player/commit/ec78f220d3adbe2aef87e6672caf3cb177a10b29))
* refactor state handling of components ([ab34337](https://github.com/ericssonbroadcastservices/javascript-player/commit/ab343379e2a4aee784da835502351638f7c878de))
* remove conditional if seeked to zero ([40d828a](https://github.com/ericssonbroadcastservices/javascript-player/commit/40d828a7e7dacbd4c3ef8b1ff7946f9eb7e7b2ac))
* remove use of useWaitForAnimationToFinish in skipButton ([f793a03](https://github.com/ericssonbroadcastservices/javascript-player/commit/f793a0395710fe7b90e68c4ec295c3bbd11d29a2))
* rename markerPoints into contentMarkers ([6bb48e2](https://github.com/ericssonbroadcastservices/javascript-player/commit/6bb48e2ecf75f96256055e82f83406e1e1eaaf33))
* rename viewtype constant and move toggle viewtype logic into skin rather than button ([417bdd1](https://github.com/ericssonbroadcastservices/javascript-player/commit/417bdd1614eac8370a76005c9b12554d4e18b32e))
* update exposureSDK-version ([d9a74be](https://github.com/ericssonbroadcastservices/javascript-player/commit/d9a74be0a9aa110e1525c104a58bc8a35b55eb79))
* update marker constants to specific start and stop events ([cf026bc](https://github.com/ericssonbroadcastservices/javascript-player/commit/cf026bc5fb6edca84327b342da64cb7921273e59))
* use locale option from player settings ([1a7b18b](https://github.com/ericssonbroadcastservices/javascript-player/commit/1a7b18b42a634b07cdd38e58f4eb0c77e30b9cbd))
* WIP add skip segment button ([5f73065](https://github.com/ericssonbroadcastservices/javascript-player/commit/5f730651fb61bb54c81971328e61740227d4d90c))
* WIP! remove use of waitForAnimationToFinish in fullskin.tsx ([43f748a](https://github.com/ericssonbroadcastservices/javascript-player/commit/43f748a7f6548f78f4846f0f96f5274babbe7ffd))



# [0.35.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.34.0...v0.35.0) (2021-09-20)


### Features

* add support for encrypted SSAI ([#207](https://github.com/ericssonbroadcastservices/javascript-player/issues/207)) ([e5f4608](https://github.com/ericssonbroadcastservices/javascript-player/commit/e5f46084267ccba19abe30b5c332b5aee80c7895))
* add support for retaining cast session between players & casting mp4 ([#208](https://github.com/ericssonbroadcastservices/javascript-player/issues/208)) ([0b78c5f](https://github.com/ericssonbroadcastservices/javascript-player/commit/0b78c5f0f699193dadddd88e9c257993045f8787))
* support playlist when airplaying ([#206](https://github.com/ericssonbroadcastservices/javascript-player/issues/206)) ([574ee98](https://github.com/ericssonbroadcastservices/javascript-player/commit/574ee981c20647ee7cac22703555c7ce0f3c2ee9))



# [0.34.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.33.0...v0.34.0) (2021-09-14)


### Bug Fixes

* CastConnector sending in bitrate incorrectly ([f40874b](https://github.com/ericssonbroadcastservices/javascript-player/commit/f40874b0adc337278521edf716190ca9dfb8ead9))
* seekTo 0 not working ([a5535a9](https://github.com/ericssonbroadcastservices/javascript-player/commit/a5535a97f9e8df9d810c1d5e2fd089c0715b807a))


### Features

* **EMP-16770:** save last used languages & update dashjs ([#203](https://github.com/ericssonbroadcastservices/javascript-player/issues/203)) ([e17d6d1](https://github.com/ericssonbroadcastservices/javascript-player/commit/e17d6d18dd8e39e2365d87a6579288823138b8dc)), closes [#205](https://github.com/ericssonbroadcastservices/javascript-player/issues/205)



# [0.33.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.32.5...v0.33.0) (2021-09-07)


### Bug Fixes

* complete tracking not happening consistently ([#197](https://github.com/ericssonbroadcastservices/javascript-player/issues/197)) ([c2ef868](https://github.com/ericssonbroadcastservices/javascript-player/commit/c2ef868274a8e1274d2c7d834e1f9fa466372f1e))
* include fps in quality level name when applicable ([#201](https://github.com/ericssonbroadcastservices/javascript-player/issues/201)) ([83f203a](https://github.com/ericssonbroadcastservices/javascript-player/commit/83f203af8f21dfa05be0608e336c5106c941bda0))


### Features

* **EMP-15540:** support trailing slash in exposure base url ([#198](https://github.com/ericssonbroadcastservices/javascript-player/issues/198)) ([074c973](https://github.com/ericssonbroadcastservices/javascript-player/commit/074c9736d8612489b07cd09aad1cc380d7580d0d))
* mdi-preact for all material icons ([#200](https://github.com/ericssonbroadcastservices/javascript-player/issues/200)) ([05b5b42](https://github.com/ericssonbroadcastservices/javascript-player/commit/05b5b4230c85fe70046c33507ee6808aa879e228))



## [0.32.5](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.32.4...v0.32.5) (2021-09-03)


### Bug Fixes

* skipping watched ad-break looping ([86cd1ab](https://github.com/ericssonbroadcastservices/javascript-player/commit/86cd1ab5ad9df5ad652f899bb7218f49e94c372c))



## [0.32.4](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.32.3...v0.32.4) (2021-08-27)


### Bug Fixes

* STB detection being case-sensitive ([1274cbe](https://github.com/ericssonbroadcastservices/javascript-player/commit/1274cbe6c22b429ef289854400405529fcf3c799))



## [0.32.3](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.32.2...v0.32.3) (2021-08-27)


### Bug Fixes

* ad impression not being tracked on older devices ([3b13b2c](https://github.com/ericssonbroadcastservices/javascript-player/commit/3b13b2c33e068bf3e192f47a227fd5da21c5fb1d))



## [0.32.2](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.32.1...v0.32.2) (2021-08-27)


### Bug Fixes

* partilly supported videoElement API always being used ([2882cec](https://github.com/ericssonbroadcastservices/javascript-player/commit/2882cec271c752238f8ba5d31047abaed09f56be))



## [0.32.1](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.32.0...v0.32.1) (2021-08-25)


### Bug Fixes

* embedded player crashing ([f8f72b5](https://github.com/ericssonbroadcastservices/javascript-player/commit/f8f72b5a085e7b458de44bb6336d41dd1c3a7548))



# [0.32.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.32.0-alpha.1...v0.32.0) (2021-08-25)


### Features

* support time & change seeking in the skin ([#195](https://github.com/ericssonbroadcastservices/javascript-player/issues/195)) ([5024963](https://github.com/ericssonbroadcastservices/javascript-player/commit/5024963bd2363672802342dffc6beb4541bff9f3))
* validate keysystem before attempting to use it ([#196](https://github.com/ericssonbroadcastservices/javascript-player/issues/196)) ([d7c04bd](https://github.com/ericssonbroadcastservices/javascript-player/commit/d7c04bda7b1d521cd88e54aaeb9349b8ca419fb0))



# [0.32.0-alpha.1](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.32.0-alpha.0...v0.32.0-alpha.1) (2021-08-23)


### Bug Fixes

* admonitor not being destroyed with the adinsertionplayer ([5dd8426](https://github.com/ericssonbroadcastservices/javascript-player/commit/5dd84264086781c50a579351aa194217a0aee58d))



# [0.32.0-alpha.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.31.1...v0.32.0-alpha.0) (2021-08-23)


### Bug Fixes

* improve detection of iframe hostname ([#194](https://github.com/ericssonbroadcastservices/javascript-player/issues/194)) ([969b3f7](https://github.com/ericssonbroadcastservices/javascript-player/commit/969b3f7de9172ce0f59f140cc31bf1b9a4d25d68))


### Features

* SSAI VOD Support ([#177](https://github.com/ericssonbroadcastservices/javascript-player/issues/177)) ([0418be5](https://github.com/ericssonbroadcastservices/javascript-player/commit/0418be522fa7b7080b6cb451ae3bd3a7accc7ec1)), closes [#193](https://github.com/ericssonbroadcastservices/javascript-player/issues/193)



## [0.31.1](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.31.0...v0.31.1) (2021-08-20)


### Bug Fixes

* enriching domain failing in iframe ([444e88e](https://github.com/ericssonbroadcastservices/javascript-player/commit/444e88e17db07ec206ad4f76e57e366322f40876))



# [0.31.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/v0.12.0...v0.31.0) (2021-08-20)


### Bug Fixes

* add entry animation delay on skin ([#174](https://github.com/ericssonbroadcastservices/javascript-player/issues/174)) ([20d8fb8](https://github.com/ericssonbroadcastservices/javascript-player/commit/20d8fb8459bad0cedd8f48bdfe262d362504c6ed))
* add missing support for `source` to playlist ([2c70bef](https://github.com/ericssonbroadcastservices/javascript-player/commit/2c70befba87cb32bb53cb55173b3a936448a7d84))
* added analytics fields according to updated spec ([#131](https://github.com/ericssonbroadcastservices/javascript-player/issues/131)) ([a068faf](https://github.com/ericssonbroadcastservices/javascript-player/commit/a068fafa8373d0073874d972bb13b10b6bb9f81c))
* added playToken as an optional init option ([28c6294](https://github.com/ericssonbroadcastservices/javascript-player/commit/28c62940e265509c2630344dd37960484610e516))
* adjust to new method name for onNow ([#121](https://github.com/ericssonbroadcastservices/javascript-player/issues/121)) ([e0b9003](https://github.com/ericssonbroadcastservices/javascript-player/commit/e0b9003691a6597eb2719668f2307b23bdec5fcd))
* adParameters not being passed to cast receiver ([1b3688c](https://github.com/ericssonbroadcastservices/javascript-player/commit/1b3688c56909bd37edd7091691b1c660525fa2eb))
* analyticsBucket used wrong data due to typo ([d94792a](https://github.com/ericssonbroadcastservices/javascript-player/commit/d94792aca62953532564da698b3ffa4939216b6e))
* avoid multiple qualities when we have 2+ audio tracks with same language ([#163](https://github.com/ericssonbroadcastservices/javascript-player/issues/163)) ([f74da52](https://github.com/ericssonbroadcastservices/javascript-player/commit/f74da525e367198443e1eb195e108d6f68828673))
* better skd check in native player ([06a46b9](https://github.com/ericssonbroadcastservices/javascript-player/commit/06a46b91d7b22af52400aa742f9df1aa068180c5))
* bump sdk to version with breaking change + fix breaks ([#166](https://github.com/ericssonbroadcastservices/javascript-player/issues/166)) ([8b782ab](https://github.com/ericssonbroadcastservices/javascript-player/commit/8b782ab7eabeffdaf7292fa9b0ca6e2c32be65d1))
* CastSenderCAF not being destroyed due to reference error ([c46c70f](https://github.com/ericssonbroadcastservices/javascript-player/commit/c46c70ff781a8032fd87380c6800bb8a8562a8f7))
* castSTate not updating on init ([758b2df](https://github.com/ericssonbroadcastservices/javascript-player/commit/758b2df123aeaabdc766b36849ea360b70a81583))
* change jump offset to 10 seconds ([#172](https://github.com/ericssonbroadcastservices/javascript-player/issues/172)) ([40558c6](https://github.com/ericssonbroadcastservices/javascript-player/commit/40558c68b520526a8d1cee8343fa59ac3e7cb379))
* desktop should always use full skin ([#181](https://github.com/ericssonbroadcastservices/javascript-player/issues/181)) ([d64972c](https://github.com/ericssonbroadcastservices/javascript-player/commit/d64972c024661bd452fe667a80959f48344c2f27))
* destroy throwing errors ([#130](https://github.com/ericssonbroadcastservices/javascript-player/issues/130)) ([bf7cb4b](https://github.com/ericssonbroadcastservices/javascript-player/commit/bf7cb4b1b0ee8a456bc22493baf8dcf0b379dc51))
* dev page set source to player options when provided ([fcec35d](https://github.com/ericssonbroadcastservices/javascript-player/commit/fcec35dc51fbd3cf6d9c986fcacbb2ce2f1ba514))
* disable HEVC if the decoder can't initialize ([#158](https://github.com/ericssonbroadcastservices/javascript-player/issues/158)) ([994ce23](https://github.com/ericssonbroadcastservices/javascript-player/commit/994ce23ae99faad90f3094c70a3040af79c953c9))
* disable program service when single event channel is detected ([#140](https://github.com/ericssonbroadcastservices/javascript-player/issues/140)) ([5fd0dea](https://github.com/ericssonbroadcastservices/javascript-player/commit/5fd0deaeff4955e57c99ee9d70f91d029d588f97))
* don't pause on single tap for touch devices ([#178](https://github.com/ericssonbroadcastservices/javascript-player/issues/178)) ([8bb5c23](https://github.com/ericssonbroadcastservices/javascript-player/commit/8bb5c23c8f861d8a8b2842f473b730739f3f28b7))
* dynamic analytics base url in web component ([a23bbca](https://github.com/ericssonbroadcastservices/javascript-player/commit/a23bbca5230fa65117e2ee2d06769e100fd5da21))
* events not cleaned up, cast session not killed on player killed ([#139](https://github.com/ericssonbroadcastservices/javascript-player/issues/139)) ([49c1c89](https://github.com/ericssonbroadcastservices/javascript-player/commit/49c1c89bc73bb46761a023824cd5371dd18eea41))
* fairplay errors ([#118](https://github.com/ericssonbroadcastservices/javascript-player/issues/118)) ([818b56a](https://github.com/ericssonbroadcastservices/javascript-player/commit/818b56ac5a40ac383868ad215fe270852bdfcaf0))
* hide scrollbar in skin metadata ([#173](https://github.com/ericssonbroadcastservices/javascript-player/issues/173)) ([ef8ef06](https://github.com/ericssonbroadcastservices/javascript-player/commit/ef8ef065ce163e37bd78057837d89b8cb05ec7d3))
* huawei phones not playing DRM ([#191](https://github.com/ericssonbroadcastservices/javascript-player/issues/191)) ([3571325](https://github.com/ericssonbroadcastservices/javascript-player/commit/35713256de44906b694b915171c9a072e73f67be))
* ignore supported formats list for custom keysystem request ([e5f6a0b](https://github.com/ericssonbroadcastservices/javascript-player/commit/e5f6a0b337b53432a7de91f176b7e4f9f6fc8df0))
* isSeekable not working correctly for live content ([#156](https://github.com/ericssonbroadcastservices/javascript-player/issues/156)) ([593d27d](https://github.com/ericssonbroadcastservices/javascript-player/commit/593d27da953f6e9dbfbc01fe8343097de1b74a6f))
* licenseUrl in Fairplay skd ([#125](https://github.com/ericssonbroadcastservices/javascript-player/issues/125)) ([cc1a812](https://github.com/ericssonbroadcastservices/javascript-player/commit/cc1a812f3941cb75e61a6b17d5e6e60d5fe81380))
* minor change to main readme ([bb20808](https://github.com/ericssonbroadcastservices/javascript-player/commit/bb20808e8fe2485d2122ea2c0f8986b15c1fc16c))
* minor visual fix on volume slider ([8aecd1a](https://github.com/ericssonbroadcastservices/javascript-player/commit/8aecd1a672c285b0b497447e8d1c0fd51d34fa34))
* moved analytics base url to be set on init ([#143](https://github.com/ericssonbroadcastservices/javascript-player/issues/143)) ([dc275ed](https://github.com/ericssonbroadcastservices/javascript-player/commit/dc275eddac244ad343ff318a3443973746cc4038))
* ms-edge android not working due to mediaSession throwing errors ([#111](https://github.com/ericssonbroadcastservices/javascript-player/issues/111)) ([86cb254](https://github.com/ericssonbroadcastservices/javascript-player/commit/86cb254c0bba2cd3f93d862c19384a1187600e28))
* native engine not using typescript, cleanup ([#107](https://github.com/ericssonbroadcastservices/javascript-player/issues/107)) ([fddc5cc](https://github.com/ericssonbroadcastservices/javascript-player/commit/fddc5ccf77afd9eb221a6394de0eb1bc24e0fc58))
* nativeName of languages not starting upper-case ([#115](https://github.com/ericssonbroadcastservices/javascript-player/issues/115)) ([699bbf3](https://github.com/ericssonbroadcastservices/javascript-player/commit/699bbf345076f2b96e1f58333fe5d84f1c36338d))
* only create ITrack when there is a track ([7f9a3dd](https://github.com/ericssonbroadcastservices/javascript-player/commit/7f9a3dda90591a6af70f3f06f18aba3d6c57909a))
* override supportedKeySystem when sending in a custom one ([2dafe3e](https://github.com/ericssonbroadcastservices/javascript-player/commit/2dafe3ec0f083bae456c766d3731081cf6eddef4))
* player crashing if ResizeObserver doesn't exist ([3f49af3](https://github.com/ericssonbroadcastservices/javascript-player/commit/3f49af31b9433c6ef123c1035caa89112f121795))
* player not going to ended state on ended ([#132](https://github.com/ericssonbroadcastservices/javascript-player/issues/132)) ([62b9504](https://github.com/ericssonbroadcastservices/javascript-player/commit/62b9504283992a0eebc19bcd890c76120d034d76))
* **Player:** Player stopped before sending end event causing broken analytics ([8a718ea](https://github.com/ericssonbroadcastservices/javascript-player/commit/8a718ea9f272741079bcdc7d707764b1dbf7f11d))
* playlist not using the `source` field ([#137](https://github.com/ericssonbroadcastservices/javascript-player/issues/137)) ([51b57dd](https://github.com/ericssonbroadcastservices/javascript-player/commit/51b57ddd6009e604114ca26515bd4d0c8361736b))
* prefix error if from a non maintained device ([#104](https://github.com/ericssonbroadcastservices/javascript-player/issues/104)) ([bb52878](https://github.com/ericssonbroadcastservices/javascript-player/commit/bb5287866d6cc5fa3a7ccdeb225372f9857aa730))
* quality control color ([c1ecbe8](https://github.com/ericssonbroadcastservices/javascript-player/commit/c1ecbe85614924ba1de884c684a8efe6974c5fcb))
* RedBeePlayer not destroying listeners ([7e4eeed](https://github.com/ericssonbroadcastservices/javascript-player/commit/7e4eeedf8dd943c8e9c0933ce1c082f8ea539f1f))
* remove ')' text ([b40a40e](https://github.com/ericssonbroadcastservices/javascript-player/commit/b40a40eacae3b1d6df86845f8ce1b58e417f7eaf))
* remove forced https dev page ([92980c9](https://github.com/ericssonbroadcastservices/javascript-player/commit/92980c9ed95e51a2dcaa62e8ee82e8d0743bfacd))
* require a sessionId to run analytics ([#168](https://github.com/ericssonbroadcastservices/javascript-player/issues/168)) ([ca23480](https://github.com/ericssonbroadcastservices/javascript-player/commit/ca23480d3cd430b4c790e3cc08140bf1f75732d6))
* resizeObserver rather than window resize for Shaka level cap ([#127](https://github.com/ericssonbroadcastservices/javascript-player/issues/127)) ([d3f5f80](https://github.com/ericssonbroadcastservices/javascript-player/commit/d3f5f80abfdb946a2ccfb0d4a30221fdd64c3a63))
* safari throwing errors when stopping ([b315c51](https://github.com/ericssonbroadcastservices/javascript-player/commit/b315c514ca0f9a5e2b12b210d7e65de3dd2b1f60))
* set audio track by raw label in shaka ([#165](https://github.com/ericssonbroadcastservices/javascript-player/issues/165)) ([9e6a411](https://github.com/ericssonbroadcastservices/javascript-player/commit/9e6a411b61031b0d648539f708d5b14ec2cef655))
* Shaka cap to follow contract restrictions ([#129](https://github.com/ericssonbroadcastservices/javascript-player/issues/129)) ([19a84c1](https://github.com/ericssonbroadcastservices/javascript-player/commit/19a84c18eb66de8e911bb75c9f51717841617580))
* shaka emitting loaded event to soon ([#185](https://github.com/ericssonbroadcastservices/javascript-player/issues/185)) ([25afe8a](https://github.com/ericssonbroadcastservices/javascript-player/commit/25afe8abcac6ce4384ea6f00dfddaef32dc6af17))
* shaka fetch presentation time from audio variant when no video ([3c88289](https://github.com/ericssonbroadcastservices/javascript-player/commit/3c8828973363d7805cde14793eabe0ad0f03ad22))
* shaka not emitting error event during startup ([#186](https://github.com/ericssonbroadcastservices/javascript-player/issues/186)) ([cc55be6](https://github.com/ericssonbroadcastservices/javascript-player/commit/cc55be6a73e41657d020dce97bb413684fbdb3f3))
* shaka-player being bundled ([6fa0c3b](https://github.com/ericssonbroadcastservices/javascript-player/commit/6fa0c3bc6bb70d7fab2f3aeb99ea0510b73a42fe))
* show progressbar when no contract rerstriction exist ([9a085c9](https://github.com/ericssonbroadcastservices/javascript-player/commit/9a085c9b3cb842b0719a5f9a53df4595f43b41f2))
* show skin on touch ([#192](https://github.com/ericssonbroadcastservices/javascript-player/issues/192)) ([5d2fbfc](https://github.com/ericssonbroadcastservices/javascript-player/commit/5d2fbfce67cab9406a37da760d493427eb5d8540))
* simplified CP player alt on demo page ([b6083bb](https://github.com/ericssonbroadcastservices/javascript-player/commit/b6083bbdc16984a397a5e45df8f08e1ac57d1313))
* skin settings as optional sdk contructor parameter ([#123](https://github.com/ericssonbroadcastservices/javascript-player/issues/123)) ([65b97c0](https://github.com/ericssonbroadcastservices/javascript-player/commit/65b97c0763a2a0fcc28f8775f8f481bab9c0523c))
* skin settings to hide quality control and jump buttons ([#124](https://github.com/ericssonbroadcastservices/javascript-player/issues/124)) ([07287a3](https://github.com/ericssonbroadcastservices/javascript-player/commit/07287a34a8b0447e754e11f57e38207268bfd7c8))
* smaller metadata image & area ([7044e0d](https://github.com/ericssonbroadcastservices/javascript-player/commit/7044e0d0ce575f8aebbc5866afb6bc8d566f990f))
* sprites not working ([916beb2](https://github.com/ericssonbroadcastservices/javascript-player/commit/916beb28ce7de195ee5f82adb53a4c70171bf7e3))
* throw error if it's a drm asset though no key system support found ([#189](https://github.com/ericssonbroadcastservices/javascript-player/issues/189)) ([b1c8349](https://github.com/ericssonbroadcastservices/javascript-player/commit/b1c83495c63c09e6525819d47edb79f99209fc6b))
* upgrade web component for the new player sdk interface ([#138](https://github.com/ericssonbroadcastservices/javascript-player/issues/138)) ([ece5bc4](https://github.com/ericssonbroadcastservices/javascript-player/commit/ece5bc427b2d08ea8045ea90ff8c7bb197c5df93))
* utc timings not set onLoaded ([#159](https://github.com/ericssonbroadcastservices/javascript-player/issues/159)) ([72961a2](https://github.com/ericssonbroadcastservices/javascript-player/commit/72961a2d343f04ddce2181e180554d02a6b2f031))
* web component dispatch player instance ([#105](https://github.com/ericssonbroadcastservices/javascript-player/issues/105)) ([992bf08](https://github.com/ericssonbroadcastservices/javascript-player/commit/992bf08fac357c8610ea37ae655027f954185d39))


### Features

* **#150:** bundle types  ([#157](https://github.com/ericssonbroadcastservices/javascript-player/issues/157)) ([08be422](https://github.com/ericssonbroadcastservices/javascript-player/commit/08be422c19b4f3468c866f88e6fa8db951234c90)), closes [#150](https://github.com/ericssonbroadcastservices/javascript-player/issues/150)
* **#170:** detect bitrate in native engine ([#171](https://github.com/ericssonbroadcastservices/javascript-player/issues/171)) ([1d3476c](https://github.com/ericssonbroadcastservices/javascript-player/commit/1d3476cba3ed4771d0b1e13478adf328d013bda6)), closes [#170](https://github.com/ericssonbroadcastservices/javascript-player/issues/170) [#170](https://github.com/ericssonbroadcastservices/javascript-player/issues/170) [#170](https://github.com/ericssonbroadcastservices/javascript-player/issues/170)
* adobe primetime auth ([#110](https://github.com/ericssonbroadcastservices/javascript-player/issues/110)) ([46ec127](https://github.com/ericssonbroadcastservices/javascript-player/commit/46ec127d3e3a88275f404de15116984b56abe80a))
* advanced web components settings ([#146](https://github.com/ericssonbroadcastservices/javascript-player/issues/146)) ([56e414a](https://github.com/ericssonbroadcastservices/javascript-player/commit/56e414a2cb000d01c3e98110b6d17046ecc7d715))
* airplay analytics ([#128](https://github.com/ericssonbroadcastservices/javascript-player/issues/128)) ([8405193](https://github.com/ericssonbroadcastservices/javascript-player/commit/8405193435a401a32087593a40b7886ea105155a))
* **Analytics:** Add default fields to all events, inc. player & device ([#106](https://github.com/ericssonbroadcastservices/javascript-player/issues/106)) ([862af7e](https://github.com/ericssonbroadcastservices/javascript-player/commit/862af7eb2705dfd1200101cda5828c5eca6dc1e7))
* audio only mode ([#161](https://github.com/ericssonbroadcastservices/javascript-player/issues/161)) ([c23f826](https://github.com/ericssonbroadcastservices/javascript-player/commit/c23f826ccf425ec5353786b9b853d1dbd5f97798))
* dashjs support ([#108](https://github.com/ericssonbroadcastservices/javascript-player/issues/108)) ([7616428](https://github.com/ericssonbroadcastservices/javascript-player/commit/7616428e8b76ccda25167a3949f33184af75bde8))
* Dispatch events in batches, fix analytics not cleaned up ([#113](https://github.com/ericssonbroadcastservices/javascript-player/issues/113)) ([466c398](https://github.com/ericssonbroadcastservices/javascript-player/commit/466c3982f08bfe43e2b2795cf1ff73132ad48edd))
* dropped frames and buffering events in exposed state data ([#179](https://github.com/ericssonbroadcastservices/javascript-player/issues/179)) ([944efbd](https://github.com/ericssonbroadcastservices/javascript-player/commit/944efbdf843c11e53ef306d3f3452c575ac78854))
* dynamic analytics base url as option ([#142](https://github.com/ericssonbroadcastservices/javascript-player/issues/142)) ([6876bec](https://github.com/ericssonbroadcastservices/javascript-player/commit/6876bec5de550bdb410f35b96ec5c6f41d079f7f))
* enriched ads options for dynamic ad insertion ([#190](https://github.com/ericssonbroadcastservices/javascript-player/issues/190)) ([6e30533](https://github.com/ericssonbroadcastservices/javascript-player/commit/6e30533623f51747a1974e685ac1f2b0fd0cfcb0))
* external id support, as alternative to asset id ([#176](https://github.com/ericssonbroadcastservices/javascript-player/issues/176)) ([27fcd8f](https://github.com/ericssonbroadcastservices/javascript-player/commit/27fcd8f7a7b7b6f21785d108945c173b1c9046d3))
* hover effect on skin buttons ([#182](https://github.com/ericssonbroadcastservices/javascript-player/issues/182)) ([da914ba](https://github.com/ericssonbroadcastservices/javascript-player/commit/da914ba14c2f3ebb5e2222f38f14a4f39662e09e))
* init option to decide keysystem override ([#183](https://github.com/ericssonbroadcastservices/javascript-player/issues/183)) ([ab78823](https://github.com/ericssonbroadcastservices/javascript-player/commit/ab78823a0515173fbfccf0f21009dbed7224b3d3))
* logger class ([#187](https://github.com/ericssonbroadcastservices/javascript-player/issues/187)) ([4af72c7](https://github.com/ericssonbroadcastservices/javascript-player/commit/4af72c7f59e2f59a37f05a51af02625e48722f09))
* metadata image as poster when no autoplay ([#112](https://github.com/ericssonbroadcastservices/javascript-player/issues/112)) ([eb392f1](https://github.com/ericssonbroadcastservices/javascript-player/commit/eb392f1de9742b38e591db8fc6a6685d714393c8))
* podcast support ([#109](https://github.com/ericssonbroadcastservices/javascript-player/issues/109)) ([2ac5b18](https://github.com/ericssonbroadcastservices/javascript-player/commit/2ac5b18c21cedc3d46ec7b24da6bcf87da373e19))
* poster support ([#180](https://github.com/ericssonbroadcastservices/javascript-player/issues/180)) ([a1424f6](https://github.com/ericssonbroadcastservices/javascript-player/commit/a1424f6ec5ee5f5786638c9d28899ddf525ec561))
* quality selector ([#119](https://github.com/ericssonbroadcastservices/javascript-player/issues/119)) ([6cc1cc0](https://github.com/ericssonbroadcastservices/javascript-player/commit/6cc1cc0849dfb20b86012fc62fd8bb556fa9c8f4))
* remove analytics as an optional module, it's required. ([93819cd](https://github.com/ericssonbroadcastservices/javascript-player/commit/93819cde9b511aa2e970ffc0b1b57c8e712b6013))
* rename modules & move airplay to core module ([#126](https://github.com/ericssonbroadcastservices/javascript-player/issues/126)) ([bff66a5](https://github.com/ericssonbroadcastservices/javascript-player/commit/bff66a5a40c42b5bf74b11b06efdb3daf4ba5c71))
* skin icons for jumping back and forth 30 sec ([#122](https://github.com/ericssonbroadcastservices/javascript-player/issues/122)) ([98d7599](https://github.com/ericssonbroadcastservices/javascript-player/commit/98d7599332be474ca6ba747e9f54cc9c8884320a))
* stop on error, ignore all recoverable shaka errors. ([#114](https://github.com/ericssonbroadcastservices/javascript-player/issues/114)) ([89443be](https://github.com/ericssonbroadcastservices/javascript-player/commit/89443be75d5e7220ffc25f66ca620fb9f4b73b44))
* support for sprite offset ([300748a](https://github.com/ericssonbroadcastservices/javascript-player/commit/300748ab50c333b5146e7f2fa8f70dbaf3747ef9))
* support multiple audio and subtitle tracks per language ([#164](https://github.com/ericssonbroadcastservices/javascript-player/issues/164)) ([56dddf1](https://github.com/ericssonbroadcastservices/javascript-player/commit/56dddf1f73912e50ce2bfce2a8a90ebf670eecce))
* track autoplay in analytics ([#188](https://github.com/ericssonbroadcastservices/javascript-player/issues/188)) ([0422927](https://github.com/ericssonbroadcastservices/javascript-player/commit/04229274ddae7b13104301cb8e616223176ac309))
* update CastSender to use CAF Receiver ([#117](https://github.com/ericssonbroadcastservices/javascript-player/issues/117)) ([0747912](https://github.com/ericssonbroadcastservices/javascript-player/commit/07479125d41134e9301e6e4713d608170780186b))
* update exposure-sdk with breaking change ([#116](https://github.com/ericssonbroadcastservices/javascript-player/issues/116)) ([64a711d](https://github.com/ericssonbroadcastservices/javascript-player/commit/64a711d1911aa3ceda6c786d375706dc7e70dec3))
* update hls.js to 1.0.0 ([#136](https://github.com/ericssonbroadcastservices/javascript-player/issues/136)) ([e283625](https://github.com/ericssonbroadcastservices/javascript-player/commit/e283625b4430a2fd18ea2694625a645bc3166336))
* update hls.js to 1.0.2 ([#144](https://github.com/ericssonbroadcastservices/javascript-player/issues/144)) ([2ffd253](https://github.com/ericssonbroadcastservices/javascript-player/commit/2ffd253de35dbdb578a8895791d7331e6d92970d))
* update shaka to 2.5.21 ([#147](https://github.com/ericssonbroadcastservices/javascript-player/issues/147)) ([c5385bc](https://github.com/ericssonbroadcastservices/javascript-player/commit/c5385bc2bdc489cb54747a3719c3d1fd8313ee94))
* wallclock timeline ([#134](https://github.com/ericssonbroadcastservices/javascript-player/issues/134)) ([1e478b0](https://github.com/ericssonbroadcastservices/javascript-player/commit/1e478b0ff8e01f3023a0c3083998f8133beadeb2))
* web component starttime support ([#175](https://github.com/ericssonbroadcastservices/javascript-player/issues/175)) ([d6371c9](https://github.com/ericssonbroadcastservices/javascript-player/commit/d6371c9a3d2cf7541de85f83e9222cd3d0a4d921))



# [0.12.0](https://github.com/ericssonbroadcastservices/javascript-player/compare/051576ca1ae4e505bdab60928b40cb6e1019e05f...v0.12.0) (2021-03-02)


### Bug Fixes

* 500 as fallback error code in safari ([81fb95c](https://github.com/ericssonbroadcastservices/javascript-player/commit/81fb95ca9f8bffeebe48163c0115d856a0ee5660))
* ability to send in playerName and playerVersion into analytics ([1401047](https://github.com/ericssonbroadcastservices/javascript-player/commit/14010475c22cca5f2613f84a42374ca5bfc2b996))
* acknowledge debug throughout the entire analytics implementation ([#60](https://github.com/ericssonbroadcastservices/javascript-player/issues/60)) ([1bec35f](https://github.com/ericssonbroadcastservices/javascript-player/commit/1bec35f54f0ba231f31e40106d308eff0dc1e901))
* add external_modules to files ([6316647](https://github.com/ericssonbroadcastservices/javascript-player/commit/63166478936f98122f05983d67949c411a771772))
* add missing exports ([3ae88d7](https://github.com/ericssonbroadcastservices/javascript-player/commit/3ae88d7272613cd8deeef4b89bd00bc3c3b62c46))
* add missing type export `ISpriteCue` ([156c36b](https://github.com/ericssonbroadcastservices/javascript-player/commit/156c36b2e5011899b7c73a9d673b92ca07ae315d))
* **AdMonitor:** adStitchEngine not destroyed with AdMonitor ([c4ac15d](https://github.com/ericssonbroadcastservices/javascript-player/commit/c4ac15dd9994a98ee30615a9b3b925530c4d6463))
* analytics not supporting different device models ([#21](https://github.com/ericssonbroadcastservices/javascript-player/issues/21)) ([a6bc867](https://github.com/ericssonbroadcastservices/javascript-player/commit/a6bc86783ec63545f0c975a17e5cf7f074c47c0c))
* audio settings showing when there is no options ([#75](https://github.com/ericssonbroadcastservices/javascript-player/issues/75)) ([f6a583b](https://github.com/ericssonbroadcastservices/javascript-player/commit/f6a583bef7bc052867212e5b0750e431b8db521c))
* auto generate deviceId if not provided ([8c013a8](https://github.com/ericssonbroadcastservices/javascript-player/commit/8c013a8463131b2e80a3beb71634c2851f9482c8))
* autoplay check not considering muted option ([#89](https://github.com/ericssonbroadcastservices/javascript-player/issues/89)) ([e1b02ba](https://github.com/ericssonbroadcastservices/javascript-player/commit/e1b02ba8c4bf648b16f1a879fca06c34d46548bc))
* autoplay sent to analytics ([ebe2a62](https://github.com/ericssonbroadcastservices/javascript-player/commit/ebe2a6277ce49031a15e1ab8f7eb67b5d00dcea6))
* better error data ([f284834](https://github.com/ericssonbroadcastservices/javascript-player/commit/f284834a6471d62bac4de44474567b036d925754))
* block multiple on now calls during ongoing requests ([f31ef27](https://github.com/ericssonbroadcastservices/javascript-player/commit/f31ef27dbd8657acbddef839019b4e8fd8b1458a))
* block seekablitiy in live hls.js if small window ([2bb4bd1](https://github.com/ericssonbroadcastservices/javascript-player/commit/2bb4bd1282c2c0fcd82c36c5f4a9289dfd0c216b))
* cast not loading new asset if previous asset was ended ([#84](https://github.com/ericssonbroadcastservices/javascript-player/issues/84)) ([700d8f4](https://github.com/ericssonbroadcastservices/javascript-player/commit/700d8f42e0c984f7f1f3dee6401f2a45ce963c08))
* cast not resuming if switching player instances in SPA ([#76](https://github.com/ericssonbroadcastservices/javascript-player/issues/76)) ([a990cea](https://github.com/ericssonbroadcastservices/javascript-player/commit/a990ceace43243b775ddf1135ac5b0af3c324aa9))
* change autoplay ([c5b7e3f](https://github.com/ericssonbroadcastservices/javascript-player/commit/c5b7e3f675c38a14a46d324accf01f08929c9fb3))
* changed heartbeat interval to 60 second ([0b749c2](https://github.com/ericssonbroadcastservices/javascript-player/commit/0b749c24688d2585cb0ad002bc9c0dc9e5b75bc7))
* **ci:** fix CI not working when not all packages will be published ([a424dff](https://github.com/ericssonbroadcastservices/javascript-player/commit/a424dff283f75cd7654f551504f350f9403f728f))
* cleanup player & skin & sdk more properly ([#58](https://github.com/ericssonbroadcastservices/javascript-player/issues/58)) ([6a9cb1d](https://github.com/ericssonbroadcastservices/javascript-player/commit/6a9cb1d766c1157969bde3751fa3f830a7e6edc3))
* cors issues when sending send & forget impressions ([722d5e7](https://github.com/ericssonbroadcastservices/javascript-player/commit/722d5e76ebee7bbe6abdd16a996f1fecda02041c))
* currentTime, duration, seekable being invalid before start ([fa0ba02](https://github.com/ericssonbroadcastservices/javascript-player/commit/fa0ba02198fc67392cf4c42fac64584df3bbed43))
* dev mode not working due to VERSION not being ignored if it isn't defined ([957d71f](https://github.com/ericssonbroadcastservices/javascript-player/commit/957d71fd13c7b98474c9a924dee80bbe73ea27a3))
* don't expose SDK types until all modules are available in npm ([dfa7ac1](https://github.com/ericssonbroadcastservices/javascript-player/commit/dfa7ac1909a5b1c5c89d8142a2115e83678fc764))
* edge 18 playback not working ([#88](https://github.com/ericssonbroadcastservices/javascript-player/issues/88)) ([d566709](https://github.com/ericssonbroadcastservices/javascript-player/commit/d566709856ac93c2d2362e65e2fd8d5beb19cd1e))
* end analytics session on error and ended ([#68](https://github.com/ericssonbroadcastservices/javascript-player/issues/68)) ([59a1ad7](https://github.com/ericssonbroadcastservices/javascript-player/commit/59a1ad7c6f66b75ad5386fef75ba3d4c4ea092dd))
* Engine should emit EngineEvents not PlayerEvents ([37a7f0c](https://github.com/ericssonbroadcastservices/javascript-player/commit/37a7f0cc8a4063ca93c5d8634908ab43cb4e9a5c))
* exitPiP spam on destroy ([02c4b3f](https://github.com/ericssonbroadcastservices/javascript-player/commit/02c4b3fef2fae5c7f075faa21c1152fafeca3131))
* export generated deviceId from ExposureService in auth response ([bc4c02c](https://github.com/ericssonbroadcastservices/javascript-player/commit/bc4c02cdbe30d8313045a3cbc3da7e15b847b313))
* exposing player version from js-player into analytics ([9ebc542](https://github.com/ericssonbroadcastservices/javascript-player/commit/9ebc542c824dd39f361b50baf74e59f1678599bd))
* ExposureService not getting httpCodes as error code ([afa542a](https://github.com/ericssonbroadcastservices/javascript-player/commit/afa542a89654169514f4016511504b526da67b03))
* ExposureService not throwing errors if JSON is OK ([#11](https://github.com/ericssonbroadcastservices/javascript-player/issues/11)) ([6451bf0](https://github.com/ericssonbroadcastservices/javascript-player/commit/6451bf02338022b9a32c229a13027f3f63a2bf16))
* failing import ([bd55bf9](https://github.com/ericssonbroadcastservices/javascript-player/commit/bd55bf93f82c73a7497dba0006886e57a852049d))
* fairplay not working ([6e01860](https://github.com/ericssonbroadcastservices/javascript-player/commit/6e0186016b411308bc26ae3bd14b8792c2c63b16))
* fairplay token typo ([6693421](https://github.com/ericssonbroadcastservices/javascript-player/commit/669342114b07719a6d8f65f400d0a6c6697a71d5))
* fallbackUTCTime not correctly removing duration in ms from Date.now() ([1677726](https://github.com/ericssonbroadcastservices/javascript-player/commit/167772685a27162a6c4b0b64a715e54a2a24500b))
* fix broken handling of starttime on load ([#96](https://github.com/ericssonbroadcastservices/javascript-player/issues/96)) ([492a342](https://github.com/ericssonbroadcastservices/javascript-player/commit/492a342d3256e6237e656731ecc9d2d6aa1bee04))
* fix deviceId being dependent on exposureService ([#37](https://github.com/ericssonbroadcastservices/javascript-player/issues/37)) ([7677a0c](https://github.com/ericssonbroadcastservices/javascript-player/commit/7677a0c65e16ac0c87eb32df7709a1e65a0291a1))
* fix margin being wrong in live mode ([da67614](https://github.com/ericssonbroadcastservices/javascript-player/commit/da676147cd03873908c27f6d69c825bef0ef28f5))
* further distance between heartbeats ([51aaec0](https://github.com/ericssonbroadcastservices/javascript-player/commit/51aaec024b554a9ab2f4c37fc8ed007d80564f6b))
* hide imageWrapper in skin, when no image exist ([5f8714b](https://github.com/ericssonbroadcastservices/javascript-player/commit/5f8714b01b756e384eda3ad3b82038b62be89c8f))
* hideControlsTimer not having a default setting ([22d3c54](https://github.com/ericssonbroadcastservices/javascript-player/commit/22d3c5429791dcf136901fa371b558746af38242))
* if already paused, do not trigger another one ([5c770f0](https://github.com/ericssonbroadcastservices/javascript-player/commit/5c770f0525438edeb604800e86f494216328bdfb))
* if no program response in on now, return ([12b3fc9](https://github.com/ericssonbroadcastservices/javascript-player/commit/12b3fc9390750a9b2f8ee0cc98c85b0d2907692b))
* improve metadata component ([#46](https://github.com/ericssonbroadcastservices/javascript-player/issues/46)) ([5ec1303](https://github.com/ericssonbroadcastservices/javascript-player/commit/5ec1303895c3b6fc8285a3e7f274955f20315610))
* improve metadataView in _most_ scenarios ([#85](https://github.com/ericssonbroadcastservices/javascript-player/issues/85)) ([cd5f0cc](https://github.com/ericssonbroadcastservices/javascript-player/commit/cd5f0cc31a2cc20131cd5d76961a7459cf16ee80))
* improve the touch experience ([#73](https://github.com/ericssonbroadcastservices/javascript-player/issues/73)) ([88b6180](https://github.com/ericssonbroadcastservices/javascript-player/commit/88b6180d132d7e68b94ae907f529b162ddc6d10e))
* improved error parsing Shaka ([64e2690](https://github.com/ericssonbroadcastservices/javascript-player/commit/64e2690e07e3fdad31fe8969fd217cbac120721f))
* include 500 in native ErrorMap as we have it as fallback ([203145c](https://github.com/ericssonbroadcastservices/javascript-player/commit/203145c4b5a526f4d37d15f18c8e3ee4a96b67fa))
* isFullscreen returning true if fs was exited using browser shortcuts ([#74](https://github.com/ericssonbroadcastservices/javascript-player/issues/74)) ([1452a3f](https://github.com/ericssonbroadcastservices/javascript-player/commit/1452a3fb737d19a6af3e7fced14220efb470a768))
* kill level earlier with dropped frames in hls.js ([1aa5310](https://github.com/ericssonbroadcastservices/javascript-player/commit/1aa5310600e7ccbd266e1b182389eb8e75991e07))
* loader not visible when skin is hidden ([#47](https://github.com/ericssonbroadcastservices/javascript-player/issues/47)) ([ca8edd2](https://github.com/ericssonbroadcastservices/javascript-player/commit/ca8edd25da65f977f03e9a0f605cad1149874b24))
* make style.css available at top level ([e2b0b68](https://github.com/ericssonbroadcastservices/javascript-player/commit/e2b0b689f13f585eca575e7639b971d6d982a19f))
* MediaSessionManager localized object parsing improvements ([ca0ea6b](https://github.com/ericssonbroadcastservices/javascript-player/commit/ca0ea6b0a095a671b7ba0d08aa46a739ed0cd7a9))
* metadata skin minor design adjustments for mobile ([1583641](https://github.com/ericssonbroadcastservices/javascript-player/commit/15836419faab0b3a157a84a0ca454bc66b816668))
* minor metadata image size bug in safari ([8bfd54d](https://github.com/ericssonbroadcastservices/javascript-player/commit/8bfd54db88ab1787217899d7dea9ef2b206d77ca))
* minor style change live button ([dee8cda](https://github.com/ericssonbroadcastservices/javascript-player/commit/dee8cda41611cd626c4851fce55db9a05eed2767))
* mobile skin not showing before playback have started ([4c76f68](https://github.com/ericssonbroadcastservices/javascript-player/commit/4c76f683007a2ee18531c5bd971c4bf53a9b7ebb))
* more proper log in not entitled scenario ([2c48a08](https://github.com/ericssonbroadcastservices/javascript-player/commit/2c48a081ed99c22e26f08e4ffae3a2317f7e4970))
* null check on localizedMetadata in MediaSessionManager ([ed96222](https://github.com/ericssonbroadcastservices/javascript-player/commit/ed962220343aa0aca8ba5a282ef2c3188064a235))
* null check whether therre exist a shaka instance on cap lecel to player size ([4096042](https://github.com/ericssonbroadcastservices/javascript-player/commit/409604258d884a6793e1dc3df8cd61039d0a2dd2))
* parse deviceId from sessionToken ([6a6982f](https://github.com/ericssonbroadcastservices/javascript-player/commit/6a6982f3b3e7fb5c2461885f3295ad94442162a5))
* player container not having a dark background ([e184953](https://github.com/ericssonbroadcastservices/javascript-player/commit/e18495358845e80dba8117ed01f8cb234a9c4a03))
* player going in to fullscreen on iOS when autoplay: true ([05ef878](https://github.com/ericssonbroadcastservices/javascript-player/commit/05ef8780ed8d4118d304610352684b5f59b813df))
* player not resuming at the right time when cast is stopped. ([#67](https://github.com/ericssonbroadcastservices/javascript-player/issues/67)) ([ec27dd0](https://github.com/ericssonbroadcastservices/javascript-player/commit/ec27dd0c02ae6533d6a722a512368312abe2445e))
* player throwing type error when program has no image ([637972b](https://github.com/ericssonbroadcastservices/javascript-player/commit/637972b35a8f5fc91649c1524ab1b06dad48856d))
* possible to set/not set debug mode for analytics in sdk ([df9e7ce](https://github.com/ericssonbroadcastservices/javascript-player/commit/df9e7ce6b95c882403a9144f657f914e154ab370))
* **ProgramService:** ignore invalid pings ([fab8cb0](https://github.com/ericssonbroadcastservices/javascript-player/commit/fab8cb01c4de85a12edaa4c07d6d3e6652f7c883))
* remove the check for whether drm request had already been made ([#80](https://github.com/ericssonbroadcastservices/javascript-player/issues/80)) ([a89e5d4](https://github.com/ericssonbroadcastservices/javascript-player/commit/a89e5d4972ae085531a74a76c7cd29faef4249d7))
* removed debug console log ([e206bbc](https://github.com/ericssonbroadcastservices/javascript-player/commit/e206bbc66b47e6abb04e9dd89496fcddaf0d1382))
* responsetype arraybuffer for irdeto fairplay license ([#61](https://github.com/ericssonbroadcastservices/javascript-player/issues/61)) ([1a9a6b5](https://github.com/ericssonbroadcastservices/javascript-player/commit/1a9a6b59e825a0a14cb665ecd7541d7bba973c0a))
* return on undefined program ends datetime in channel program service ([7d3113a](https://github.com/ericssonbroadcastservices/javascript-player/commit/7d3113aea0f2add98f63b5dbcda4640144346c53))
* rounded seconds in human readale time string ([d6d4e14](https://github.com/ericssonbroadcastservices/javascript-player/commit/d6d4e14245320edafc8d19b2c6df237e89f26b4b))
* safari getting stuck in buffering ([#81](https://github.com/ericssonbroadcastservices/javascript-player/issues/81)) ([013e3fe](https://github.com/ericssonbroadcastservices/javascript-player/commit/013e3fe386e841074878fe71a27ad9ab7e9a7b5e))
* safari not sending pause event ([#63](https://github.com/ericssonbroadcastservices/javascript-player/issues/63)) ([49772fb](https://github.com/ericssonbroadcastservices/javascript-player/commit/49772fbfdcf7113e263c099eeeb6a096323e8238))
* send in assetId to analytics ([18dcb36](https://github.com/ericssonbroadcastservices/javascript-player/commit/18dcb366ed1bdb4b7d4ed5232c378f75b14ea5b6))
* send in assetId with error in analytics ([acd03c1](https://github.com/ericssonbroadcastservices/javascript-player/commit/acd03c1479cce5c51efd5340b061ca1efe88edb8))
* set a full state by default ([#44](https://github.com/ericssonbroadcastservices/javascript-player/issues/44)) ([bd80b77](https://github.com/ericssonbroadcastservices/javascript-player/commit/bd80b771340c9ff22f8aca21a2beb68f669a5239))
* set default font-size to prevent invalid conf by implementor ([46152fc](https://github.com/ericssonbroadcastservices/javascript-player/commit/46152fc5ec6a57292203d9dc4450fb66fdb56fda))
* set isMuted based on the volumechange event, not on a method call ([bdfe41c](https://github.com/ericssonbroadcastservices/javascript-player/commit/bdfe41c06fcf9d2e84c1352136619796a5ad642e))
* set muted correct and update the state during playback ([#70](https://github.com/ericssonbroadcastservices/javascript-player/issues/70)) ([c968913](https://github.com/ericssonbroadcastservices/javascript-player/commit/c9689131c0af3c3b17e07ce68dc1d9498128bc68))
* shaka error simplification ([e29e54c](https://github.com/ericssonbroadcastservices/javascript-player/commit/e29e54cab80fb115f143c678b116440265b3ae3c))
* shaka not playing finished live events, fix seekTo not clamping to seekable ([#91](https://github.com/ericssonbroadcastservices/javascript-player/issues/91)) ([e756d02](https://github.com/ericssonbroadcastservices/javascript-player/commit/e756d029da5a5e815fa034a72a088b8106f292c6))
* thresholds for level capping in Shaka ([#69](https://github.com/ericssonbroadcastservices/javascript-player/issues/69)) ([6f37589](https://github.com/ericssonbroadcastservices/javascript-player/commit/6f3758978d84b613947afbf07a8b503a529efdc5))
* Throwing error on Safari decryption error ([#64](https://github.com/ericssonbroadcastservices/javascript-player/issues/64)) ([1843ad8](https://github.com/ericssonbroadcastservices/javascript-player/commit/1843ad815b5733b879ec73b3537f0290093d7102))
* Tizen TV being detected as Safari ([ff78cd6](https://github.com/ericssonbroadcastservices/javascript-player/commit/ff78cd616b7ff11295592454091f6b1e3cce0024))
* treat events as optional ([3f42b67](https://github.com/ericssonbroadcastservices/javascript-player/commit/3f42b67db20ff84879c179a168b3c34fd0aeaccc))
* trigger play after airplay screen change ([#102](https://github.com/ericssonbroadcastservices/javascript-player/issues/102)) ([98fc9b4](https://github.com/ericssonbroadcastservices/javascript-player/commit/98fc9b4ed89dd38ec9aa5cf610cf7956054cc8cb))
* type error ([6ca324b](https://github.com/ericssonbroadcastservices/javascript-player/commit/6ca324b23bcdb2d0bed7574091140a2e8cdeb50d))
* typo in allowPictureInPicture ([d666587](https://github.com/ericssonbroadcastservices/javascript-player/commit/d666587a9f26481fedafcabcef9d179e0e293050))
* update css name ([bc830b5](https://github.com/ericssonbroadcastservices/javascript-player/commit/bc830b5f0ad78e8878d48e40a576cafe170cc826))
* user active callbacks not firing ([#72](https://github.com/ericssonbroadcastservices/javascript-player/issues/72)) ([593e987](https://github.com/ericssonbroadcastservices/javascript-player/commit/593e98766b6d3f7d77d675bdb83009f6b74f4cc9))
* username and password optional for authentication, going into anonymous if non existent ([bb304bb](https://github.com/ericssonbroadcastservices/javascript-player/commit/bb304bb9078a4372733089c29c5e58fdbb3e9747))
* using warn instead of error when init cast fails ([dffc1f7](https://github.com/ericssonbroadcastservices/javascript-player/commit/dffc1f7528978583140cf1a78d1909aaaf1d2e1b))
* version number being hardcoded ([051576c](https://github.com/ericssonbroadcastservices/javascript-player/commit/051576ca1ae4e505bdab60928b40cb6e1019e05f))
* workflow not triggering ([768ca88](https://github.com/ericssonbroadcastservices/javascript-player/commit/768ca887a05482082fe6d58f179e8836864ee0ed))


### Features

* add bundleable SDK ([#32](https://github.com/ericssonbroadcastservices/javascript-player/issues/32)) ([d68e417](https://github.com/ericssonbroadcastservices/javascript-player/commit/d68e4179df9558119652340db68d4f62992fdac4))
* add cast support ([#55](https://github.com/ericssonbroadcastservices/javascript-player/issues/55)) ([35ea240](https://github.com/ericssonbroadcastservices/javascript-player/commit/35ea2407a81d5381a6d10c3f24e6edf69ab91487))
* add CastConnector to analytics, add support for new CastReceiver ([#87](https://github.com/ericssonbroadcastservices/javascript-player/issues/87)) ([3300437](https://github.com/ericssonbroadcastservices/javascript-player/commit/3300437ab99a0301da28602ac01b4d2a8fe9cc6b))
* add disable cast option ([#82](https://github.com/ericssonbroadcastservices/javascript-player/issues/82)) ([e0599d2](https://github.com/ericssonbroadcastservices/javascript-player/commit/e0599d29413dd7bea61cd0823d96797ada502855))
* add mobile skin ([#71](https://github.com/ericssonbroadcastservices/javascript-player/issues/71)) ([d10d526](https://github.com/ericssonbroadcastservices/javascript-player/commit/d10d5265e4ce3046ea155f68ffece3b1069a02b2))
* add npm version of web-component ([#103](https://github.com/ericssonbroadcastservices/javascript-player/issues/103)) ([a4392a8](https://github.com/ericssonbroadcastservices/javascript-player/commit/a4392a8f4b88b1310923b8cd1e725defbae0329c))
* add onSkinHidden/onSkinVisible ([#77](https://github.com/ericssonbroadcastservices/javascript-player/issues/77)) ([30f3774](https://github.com/ericssonbroadcastservices/javascript-player/commit/30f3774008e3f8191a3aa0aec2853d7e205e03c8))
* add optional fullscreen element ([#90](https://github.com/ericssonbroadcastservices/javascript-player/issues/90)) ([f565f62](https://github.com/ericssonbroadcastservices/javascript-player/commit/f565f62314513bd35f37b91066eea3d51c1240dd))
* add picture-in-picture support ([#56](https://github.com/ericssonbroadcastservices/javascript-player/issues/56)) ([07a8a10](https://github.com/ericssonbroadcastservices/javascript-player/commit/07a8a103a0b6037f1208092dfcff43ff99cf11f1))
* add player-skin ([91f7404](https://github.com/ericssonbroadcastservices/javascript-player/commit/91f740407133ddd2dfc81757c71a5f8f9e02deb3)), closes [#28](https://github.com/ericssonbroadcastservices/javascript-player/issues/28) [#31](https://github.com/ericssonbroadcastservices/javascript-player/issues/31)
* add support for audioTracks in the HlsJs engine. ([#39](https://github.com/ericssonbroadcastservices/javascript-player/issues/39)) ([612f42d](https://github.com/ericssonbroadcastservices/javascript-player/commit/612f42d45e67864fad7efdb025951ea0735c001e))
* add support for https in the development page ([13a74dc](https://github.com/ericssonbroadcastservices/javascript-player/commit/13a74dc178715738067435fd5628d02896013192))
* add thumbnail when hoving progressbar ([#43](https://github.com/ericssonbroadcastservices/javascript-player/issues/43)) ([cdb1b3a](https://github.com/ericssonbroadcastservices/javascript-player/commit/cdb1b3a1b44779779725687796fa1b4f594ca624))
* add types to package.json ([c0681b6](https://github.com/ericssonbroadcastservices/javascript-player/commit/c0681b6f024a0a6eebcc97dff29412c165f74b5e))
* add UTC time support ([#53](https://github.com/ericssonbroadcastservices/javascript-player/issues/53)) ([df141d9](https://github.com/ericssonbroadcastservices/javascript-player/commit/df141d93ce3d0a129c3bc6edcd3193e5605bb101))
* **analytics:** support for ad analytics events ([#98](https://github.com/ericssonbroadcastservices/javascript-player/issues/98)) ([66d8d70](https://github.com/ericssonbroadcastservices/javascript-player/commit/66d8d70d1b93d8b05bf3559de2ee3fd8d1b7e3eb))
* **demo:** add new.css to make the demo site prettier ([fcc2603](https://github.com/ericssonbroadcastservices/javascript-player/commit/fcc2603692a2f0664761937906d4c17fa0cfe275))
* detect change of asset id and load new asset on chromecast ([#62](https://github.com/ericssonbroadcastservices/javascript-player/issues/62)) ([8c452b3](https://github.com/ericssonbroadcastservices/javascript-player/commit/8c452b381bc46cb5bb77ba28477347d02c496575))
* drm analytics ([#19](https://github.com/ericssonbroadcastservices/javascript-player/issues/19)) ([c6a6f7e](https://github.com/ericssonbroadcastservices/javascript-player/commit/c6a6f7e35efc33aa396805173851653fc1521794))
* expose toggle muted method on player ([#20](https://github.com/ericssonbroadcastservices/javascript-player/issues/20)) ([880e4d2](https://github.com/ericssonbroadcastservices/javascript-player/commit/880e4d26254ddf7674ecf0670c8fa4dd9a16b0f6))
* human readable vod duration in metadata overlay ([2243c84](https://github.com/ericssonbroadcastservices/javascript-player/commit/2243c840f6c8152cc1f3b5f8b8d8b61d8fd8d021))
* ignore startTime if it's over 95% played ([#16](https://github.com/ericssonbroadcastservices/javascript-player/issues/16)) ([3c12b28](https://github.com/ericssonbroadcastservices/javascript-player/commit/3c12b28f9d45973dadec33e315439064e9151b8e))
* implement playPauseStop instead of playPause button ([#41](https://github.com/ericssonbroadcastservices/javascript-player/issues/41)) ([4e9adea](https://github.com/ericssonbroadcastservices/javascript-player/commit/4e9adea2fc1dc1ae351c2225ac48376885ae8f13))
* improve configuration for shaka live ([#83](https://github.com/ericssonbroadcastservices/javascript-player/issues/83)) ([2591d45](https://github.com/ericssonbroadcastservices/javascript-player/commit/2591d4590328c727ecd43e1a1d1e66690bddde9b))
* improve the visibility toggle of the volume slider ([#50](https://github.com/ericssonbroadcastservices/javascript-player/issues/50)) ([eeda548](https://github.com/ericssonbroadcastservices/javascript-player/commit/eeda5482bb73cbbe77236d419b486dc7a12b03fb))
* keyboard shortcuts ([#22](https://github.com/ericssonbroadcastservices/javascript-player/issues/22)) ([92439ba](https://github.com/ericssonbroadcastservices/javascript-player/commit/92439ba59f5eacd59f535959f519f05bf87964cf))
* program-service ([#95](https://github.com/ericssonbroadcastservices/javascript-player/issues/95)) ([590d903](https://github.com/ericssonbroadcastservices/javascript-player/commit/590d903deeb377a22089ef05c5306f36b8e98b0a))
* progressbar design improvements ([#38](https://github.com/ericssonbroadcastservices/javascript-player/issues/38)) ([980d54c](https://github.com/ericssonbroadcastservices/javascript-player/commit/980d54ca6385979fa2f93eb5bfec951168ce20a7))
* remove un-used and broken changelogs ([ba253c3](https://github.com/ericssonbroadcastservices/javascript-player/commit/ba253c32761bb8e2f1626ba4e3dc5bdbed77fb8f))
* rename scope to [@redbeemedia](https://github.com/redbeemedia) ([c69428a](https://github.com/ericssonbroadcastservices/javascript-player/commit/c69428ac20c3be55ff802988ed301e232dfcf7ac))
* revert scope name change ([b94f998](https://github.com/ericssonbroadcastservices/javascript-player/commit/b94f998d38eb6d47e065742838114a70d55e6407))
* seekToLive method for live ([#14](https://github.com/ericssonbroadcastservices/javascript-player/issues/14)) ([31dcd4c](https://github.com/ericssonbroadcastservices/javascript-player/commit/31dcd4c5f148fdaea6ec3c051034607cead49482))
* Set max resolution of level playing to element size in Shaka ([#57](https://github.com/ericssonbroadcastservices/javascript-player/issues/57)) ([24369f3](https://github.com/ericssonbroadcastservices/javascript-player/commit/24369f384237930986476c93a701f2087a2edd56))
* set playbackRate method ([#101](https://github.com/ericssonbroadcastservices/javascript-player/issues/101)) ([b0af171](https://github.com/ericssonbroadcastservices/javascript-player/commit/b0af171bef6e9f7fe1dbb8616e738d48b92cd6da))
* SSAI Step 1 ([#23](https://github.com/ericssonbroadcastservices/javascript-player/issues/23)) ([84792aa](https://github.com/ericssonbroadcastservices/javascript-player/commit/84792aa15b36647ef0696e70e4bd05e6f1fb06f8))
* SSAI support ([#27](https://github.com/ericssonbroadcastservices/javascript-player/issues/27)) ([6db7af3](https://github.com/ericssonbroadcastservices/javascript-player/commit/6db7af3362fe646726e3d69f0d87cce8592c074f)), closes [#97](https://github.com/ericssonbroadcastservices/javascript-player/issues/97)
* support multiple sprite sizes ([#51](https://github.com/ericssonbroadcastservices/javascript-player/issues/51)) ([b19ddcf](https://github.com/ericssonbroadcastservices/javascript-player/commit/b19ddcf00f1c5262b7fe660135b16f5457218b6b))
* support setting env using queryParameters ([c9ce3ef](https://github.com/ericssonbroadcastservices/javascript-player/commit/c9ce3ef235c23f4d90d05694047214fb42b66565))
* update engines ([#79](https://github.com/ericssonbroadcastservices/javascript-player/issues/79)) ([46426a7](https://github.com/ericssonbroadcastservices/javascript-player/commit/46426a700094f3f640ae7d26ee176ae53666179f))
* update settings-menu layout to differn depending on player width ([#36](https://github.com/ericssonbroadcastservices/javascript-player/issues/36)) ([9e2af9b](https://github.com/ericssonbroadcastservices/javascript-player/commit/9e2af9bf9a787ae83f0c35af10e40e14c8ccb89c))
* use microbundle version 0.12.4 ([12b31e2](https://github.com/ericssonbroadcastservices/javascript-player/commit/12b31e2c06bef1d86d4ff5ff1628a0c5277dd4c6))



