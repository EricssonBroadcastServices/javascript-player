<!--
SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>

SPDX-License-Identifier: CC-BY-SA-4.0
-->

**v1.6.0** (2024-04-03)

**v1.6.0-internal.2** (2024-03-28)

Features

* Support FAIRPLAY_LICENSE_ERROR and FAIRPLAY_CERTIFICATE_ERROR metrics

Bug Fixes

* Properly parse urls when throwing errors in exposure service

**v1.6.0-internal.1** (2024-03-06)

Bug Fixes

* Do not show forced text tracks as selectable

**v1.6.0-internal.0** (2024-02-29)

Bug Fixes

* Reenable the pingstate when it is a single program and has ended

**v1.5.2-internal.0** (2024-02-12)

**v1.5.1** (2024-01-24)

Bug Fixes

* Low latency stream not catching up correctly

**v1.5.0** (2024-01-24)

**v1.5.0-internal.0** (2024-01-18)

Bug Fixes

* PlaybackRate decreased when playing low latency content close to live edge
* Add ProgramAssetId to programChanged event in analytics
* Unhandled rejection error when load media fails

**v1.4.0** (2023-12-22)

Features

* Add clockOffset to analytics payload

Bug Fixes

* .play() return type is void, should be Promise<void>
* Always use epgs as program source in the program service
* TypeError thrown when trying to access track info too early

**v1.4.0-internal.1** (2023-12-12)

Bug Fixes

* IsBrowserSupported not detecting lg tv & samsung tv 2017+ as supported
* Set UTC startTime and currentTime before triggering the LOADED event
* Ssai not working with playready

**v1.4.0-internal.0** (2023-12-07)

Features

* Set os name & verison for analytics instead of parsing userAgent
* Add translations for player skin strings

Bug Fixes

* Emit PlayerEvent.ERROR for cast load error
* Seek doesn't work on low latency channels
* Microsoft edge can't play HEVC streams with DRM protection
* Multi-line subtitle rendering
* Low latency channels latency higher than 1 fragment duration
* Poster not fully visible

**v1.3.0** (2023-11-20)

**v1.3.0-internal.4** (2023-11-16)

**v1.3.0-internal.3** (2023-11-16)

Bug Fixes

* Lg, some catchup content not starting
* Web component skin not being built
* Stuck at buffering when starting certain catchup content

**v1.3.0-internal.2** (2023-11-07)

Bug Fixes

* Captions sometimes not showing as active
* Content sometimes not starting after adbreak on samsung tv

**v1.3.0-internal.1** (2023-11-07)

Bug Fixes

* Firefox crashes frequently on live content

**v1.3.0-internal.0** (2023-10-30)

Features

* ES5 transpiled bundle

Bug Fixes

* Add missing polyfills to demo package.json
* Firefox crashing when playing certain live content

**v1.2.1** (2023-10-25)

Bug Fixes

* Fix ads click through button not showing in mobile skin

**v1.2.0** (2023-10-20)

**v1.2.0-internal.3** (2023-10-17)

Bug Fixes

* Prevent trying to set shaka config restrictions after destroying shaka

**v1.2.0-internal.2** (2023-10-17)

**v1.2.0-internal.1** (2023-10-12)

Bug Fixes

* Add missing exports, skin options

**v1.2.0-internal.0** (2023-10-09)

Features

* Support chromecast receiver with queue

**v1.1.0** (2023-10-06)

Features

* Upgrade dashjs to 4.7.2

Bug Fixes

* Add workaround for dashjs-engine overriding user audio track preferences after ad break
* Fix subtitle duplication issues when using the dashjs engine
* Filter out ads-only languages from the audio language options
* Preferred language doesn't work if metadata is missing
* Upgrade to shaka 4.4.3

**v1.1.0-internal.0** (2023-09-28)

Features

* Upgrade shaka to 4.4.2

Bug Fixes

* Check if startTime is specifically not undefined
* Fix Shaka engine configuration so that subtitle streams update more reliably
* TogglePictureInPicture crashes on audioOnly content

**v1.0.2** (2023-09-22)

Bug Fixes

* Analytics receiving bps instead kbps
* WebOS 4.x live seek moves seekable end to seek position. #564
* Support startTime argument 0 for live streams
* Hls live streams not seekable on WebOS 3.5
* Fix subtitles not showing after an ad break
* Live streams starts from beginning

**v1.0.1** (2023-07-07)

Bug Fixes

* Ads options not passed in play request

**v1.0.0** (2023-06-29)

Features

* Add type to browser device model
* Automatically detect samsung & lg tv devices
* Select preferred audio/text subtitles based on locale option
* Show error overlay on error
* Replace audio track icon in default skin to use `account-voice`
* Generate device id for all devices
* Add `deviceAdapter` option to allow custom device detection
* Support internal SSAI stitcher
* Set loading state as early as possible

Bug Fixes

* Autoplay detection doesn't work on samsung
* Avoid nested classes (higher CSS specificity than documented) for subtitles
* Live channels always starts at live edge
* Virtual channels, only first program detected
* Fix web-components attribute change issues
* Fix SSAI player not respecting user track choices, by switching internal player to Shaka
* Fix playbackRate blocking for AdsInsertionPlayer
* Hls live: invalid duration & seekable
* Track id type is always string when it can be number
* Volume & text tracks event not working on safari

**v0.69.0** (2023-05-30)

Features

* Bump dash.js to 4.7.0

**v0.68.0** (2023-05-29)

Features

* Add optional playAsset params start,end

**v0.67.0** (2023-05-23)

Bug Fixes

* Nowtilus lg workaround applied for all stitchers

**v0.66.2** (2023-04-14)

Bug Fixes

* Hls live: invalid duration & seekable

**v0.66.1** (2023-04-13)

Bug Fixes

* Mp3 not playable on LG WebOS 5.0+

**v0.66.0** (2023-04-04)

Bug Fixes

* Add missing PlayerEvent.ERROR event for playlists
* Timeline not fully seekable, hls|chrome,firefox,edge

**v0.66.0-internal.3** (2023-03-31)

Bug Fixes

* Fix content pausing after ads[dash, ssai]

**v0.66.0-internal.2** (2023-03-29)

Features

* Support setting default subtitle and audio based on language and kind

Reverts

* Revert "style(EMP-19605): Replace audio track icon in default skin to use `account-voice` (#453)"

**v0.66.0-internal.1** (2023-03-24)

**v0.66.0-internal.0** (2023-03-17)

Bug Fixes

* Bump mux-embed package and js-player dependency
* Add support for UTC time for VOD DASH in dash.js
* Only integers allowed as utcStartTime
* EPG API error unhandled
* Forced subtitles are hidden

**v0.65.1-internal.0** (2023-02-23)

Bug Fixes

* Fullscreen promises unhandled
* LG pauses between ads

**v0.65.0** (2023-02-22)

**v0.65.0-internal.0** (2023-02-22)

Features

* Use Shaka for SSAI

Bug Fixes

* Include analyticsBaseUrl and analyticsPercentage in analytics payload

**v0.64.0** (2023-02-20)

Features

* Dash.js on LG
* Add support for startTime and picking up from lastViewedOffset
* Add offset to subtitle container to stay above menu

**v0.63.1** (2023-02-16)

Bug Fixes

* Separate subtitle container element into two concerns

**v0.63.0** (2023-02-09)

Features

* Bump player-plugins js-player peer dependency and mux-embed
* Bump Shaka to v4.3.3
* Spread entitlement

Bug Fixes

* Cannot confidently read errorType & errorGroup from PlayerError
* Fix chaining
* Make isPictureinPictureSupported() work before setup
* Errors are emitted because the player was destroyed

**v0.62.0** (2023-02-02)

Features

* Change subtitle toggle icon

Bug Fixes

* Program service type errors
* Refactor program service

**v0.61.0** (2023-01-27)

Features

* Add subtitle toggle

**v0.60.0** (2023-01-24)

Features

* Include dropped frames count in mux data plugin

**v0.59.7** (2023-01-23)

**v0.59.6** (2023-01-20)

Bug Fixes

* Bump plugins package deps
* Fix typo in shaka default configuration

**v0.59.5** (2023-01-12)

Bug Fixes

* Properly check if text track includes language

**v0.59.4** (2023-01-10)

Bug Fixes

* Include image assets in webpack build
* Update `IInternalPlayerState` interface with correct types

**v0.59.3** (2022-12-19)

Bug Fixes

* Hls subtitles kind

**v0.59.2** (2022-12-19)

Bug Fixes

* Check if text track includes language if not set media track label to "-"
* Restore old shaka config

**v0.59.1** (2022-12-12)

Bug Fixes

* Add workaround for seeking bug on chromecast

**v0.59.0** (2022-12-05)

Bug Fixes

* Always return the core methods in the Red Bee player
* Mislabeled error code(s)
* Initialise dropped frames set to 0
* Initialise logger before usage
* Read source from url on devpage

**v0.58.0** (2022-11-29)

Features

* Migrate from exposure api to eventsink

Bug Fixes

* Do not clean branch of already existing files before push
* Fix types / incorrect assumption for ads.stitcher
* Refactor engine name/version.
* Set exposureBaseUrl when initialising a new PlayerCoreConnector

**v0.57.0** (2022-11-15)

Features

* Prepare mux stream info

**v0.56.1** (2022-11-15)

Features

* Get stream metadata
* Player init events

Bug Fixes

* Action to deploy dev-player to version folder
* Bump Mux Data peerDependencies version
* Correctly handle seek event in Shaka on startup
* Filter out metadata textTracks in `getSubtitleTracks`
* Make it possible to override `AbstractBaseEngine` native events
* Start listening for events before loading player
* Update shaka default config

**v0.56.0** (2022-11-07)

Features

* Add load start event

Bug Fixes

* Always use milliseconds when setting current time for Mux Data

**v0.55.1** (2022-10-28)

Bug Fixes

* Analytics player ready

**v0.55.0** (2022-10-28)

Features

* Support custom Mux Data metadata fields

**v0.54.5** (2022-10-26)

Bug Fixes

* Mux patches

**v0.54.4** (2022-10-26)

Bug Fixes

* Add player as peer dep to mux plugin
* Dynamically read video element in mux

**v0.54.3** (2022-10-26)

Bug Fixes

* Safety check in mux plugin

**v0.54.2** (2022-10-26)

**v0.54.1** (2022-10-25)

**v0.54.0** (2022-10-25)

Features

* Add qr code to dev page

Bug Fixes

* Include js-player-plugins in development package

**v0.53.1** (2022-10-19)

Bug Fixes

* Copy missing style.css when deploying dev page
* Ads can be skipped on safari iOS 16
* Update selected audio track when switching audio track

**v0.53.0** (2022-10-17)

Features

* Subtitle positioning support and Shaka color fix

Bug Fixes

* Set subtitle depending on language and kind
* Auto selecting subtitles not working in hls.js
* Use npx for running webpack in workflow

**v0.52.0** (2022-09-21)

Features

* Seek to wall clock time given as UTC timestamp

**v0.51.1** (2022-09-16)

Bug Fixes

* Check for metadataURIs in initOptions and not options

**v0.51.0** (2022-09-13)

Features

* Timed metadata

Bug Fixes

* Set heartbeat depending on `analyticsPostInterval`

**v0.50.2** (2022-09-08)

Bug Fixes

* Use preload auto on firefox in native engine

**v0.50.1** (2022-09-06)

Bug Fixes

* Only do hls parsing on hls manifests

**v0.50.0** (2022-08-22)

Features

* Use latest version of Shaka Player

**v0.49.5** (2022-08-11)

Bug Fixes

* Hide subtitles when turned off

**v0.49.4** (2022-08-02)

Bug Fixes

* Use `display: inline-block` for ad index label

**v0.49.3** (2022-07-05)

**v0.49.2** (2022-06-28)

**v0.49.1** (2022-06-27)

Bug Fixes

* Adjust mindvr window
* Use dashjs for adinsertionplayer

**v0.49.0** (2022-06-22)

Features

* SSAI Support on LG 2017-2019

**v0.48.0** (2022-06-13)

Features

* Send locale to cast

Bug Fixes

* Hls.js displays native subtitles

**v0.47.1** (2022-06-07)

Bug Fixes

* Add offset to scrubbed to event
* Core css not included in player package

**v0.47.0** (2022-05-23)

Features

* Add meterialProfile to play call

**v0.46.0** (2022-05-13)

Features

* Support custom ad parameters to be sent to play call

Bug Fixes

* Align ad counter with other platforms
* Use explicit line height for subtitles

**v0.45.0** (2022-05-10)

Features

* Full player area ad clickthrough

**v0.44.2** (2022-05-09)

Bug Fixes

* Subtitles tiny on lg

**v0.44.1** (2022-05-09)

Bug Fixes

* Subtitles are rendered without line-breaks

**v0.44.0** (2022-05-09)

Features

* Ad countdown

Bug Fixes

* 4K material crashing certain LG devices

**v0.43.5** (2022-05-05)

Bug Fixes

* Sync packages
* Updated dependencies

**v0.43.4** (2022-05-05)

Bug Fixes

* All impressions aren't sent
* CastConnectors sends in bps instead of kbps when bit
* Bump sdk to remove maxlength on description
* Initial analytics dispatch

**v0.43.3** (2022-04-19)

Bug Fixes

* Live ssai infinite bufferings after a few seconds

**v0.43.2** (2022-03-29)

Bug Fixes

* Switching XMLHttpRequest to fetch for fairplay license impl
* Updated hls.js

**v0.43.1** (2022-03-29)

Bug Fixes

* Subtitles cover screen on mobile

**v0.43.0** (2022-03-24)

Features

* Render subtitles in the DOM

Bug Fixes

* Null check analytics options before reaching app name

**v0.42.0** (2022-03-22)

Features

* Added richer app data to analytics payload

Bug Fixes

* Analytics heartbeat fixes
* Hardening to event pool dispatch on page close
* Use duration in milliseconds for bookmarks check

**v0.41.4** (2022-03-03)

Bug Fixes

* Audio only check failed playing external source

**v0.41.3** (2022-02-28)

Bug Fixes

* Include proper files in vtt parser package

**v0.41.2** (2022-02-28)

Features

* Add sprite vtt parser as separate package

**v0.41.1** (2022-02-25)

Bug Fixes

* Bump sdk version to fix typo in export
* Updated analytics to include app type

**v0.41.0** (2022-02-22)

Features

* Maxresolution as init option to send along the play call
* Support for custom engine configuration

Bug Fixes

* Pause ad stream on visibility hidden
* Reset playbackrate during ads
* Ssai added tracking for loaded and start
* Typescript signatures to signal null as valid data in subtitle methods

**v0.40.1** (2022-01-27)

Bug Fixes

* Use default presentation delay

**v0.40.0** (2022-01-19)

Features

* Improve subtitle rendering
* Exposing media type in player state
* Usage of hls.js for live delay support on hls live streams

**v0.39.0** (2021-12-21)

Features

* Report manual bitrate changes to analytics

Bug Fixes

* Live delay was never set due to failing if statement

**v0.38.3** (2021-12-15)

Bug Fixes

* Bitrate change wasn't triggered when start time was 0

**v0.38.2** (2021-12-14)

Bug Fixes

* Regression with eventsink url path being overwritten

**v0.38.1** (2021-12-10)

Bug Fixes

* Improve clenaup of cast connector

**v0.38.0** (2021-12-07)

Features

* Support for clickthrough on ads

**v0.37.9** (2021-12-01)

Bug Fixes

* Add missing error message to cast errors

**v0.37.8** (2021-11-04)

Bug Fixes

* Broken package-locks
* Don't disable heartBeat onPause()
* Remove comment

**v0.37.7** (2021-10-18)

Bug Fixes

* Broken vast parsing

**v0.37.6** (2021-10-14)

Bug Fixes

* Multi-period dash not playing if startTime is too close to new period

**v0.37.5** (2021-10-12)

Bug Fixes

* Wrong versions marked in package.json

**v0.37.4** (2021-10-11)

Bug Fixes

* Bump can-autoplay to fix memory leak
* Dashjs not playing smoothstreaming from source
* Just show marker points menu when applicable types is set

**v0.37.3** (2021-10-07)

Bug Fixes

* Cast session being broken if not stopping session completely

**v0.37.2** (2021-10-07)

Bug Fixes

* Cast controls crashing due to type error

**v0.37.1** (2021-10-06)

Bug Fixes

* Null references

**v0.37.0** (2021-10-06)

Features

* Remove init call & fix broken analytics cleanup
* Export `IPlayerState`
* Subtitle color support

Bug Fixes

* Comment on config
* Sort quality levels exposed in state
* Subtitles not selectable for multi-period dash
* Type error

**v0.36.2** (2021-09-27)

Bug Fixes

* Null check for asset metadata before trying to get markers

**v0.36.1** (2021-09-23)

Bug Fixes

* Huge subtitles in chrome

**v0.36.0** (2021-09-22)

Features

* Add checkifActiveplayer event and emit on event start and event end
* Add constant isMobile in playerSkin
* Add cuepoint menu with seekTo function.
* Add handler for multiple intros and credits
* Add isMobile-check to set fontsize on skipbutton
* Add material Icons
* Add minor css-changes
* Add more icons, update css and refactor cuePointMenu
* Add notes on nicetimeformat function
* Add statehandler, add on hover popup
* Add toggle on menu buttons click
* Add transition in and out of skipsegment button
* Add transitions when toggling between menus
* Add useAnimate hook for smoother transitions between menus
* Add working seek from mobile skin
* Animate between screens with css without animation hook
* Create cuePoints button
* Dont show contentmarkers if list is empty
* Fixup! seek to chapter endoffset in seconds
* Hide skin on mobile when browsing cuepoints
* Hide skip button after twice the time of hidecontrols, defaults to 4seconds
* Listen only to activeIntros since we're  only using that type in the skin
* Make that only intros are skippable
* Move activeContentMarker into metadata state
* Move contentMarker check into own method.
* Move VIEW_TYPE enum to skin constants.ts
* Only render cuepoint menu if cuepoints exists
* Prolong time of skip visibility after user is deemed inactive
* Refactor onclick  code
* Refactor reading of intro and credits markers
* Refactor state handling of components
* Remove conditional if seeked to zero
* Remove use of useWaitForAnimationToFinish in skipButton
* Rename markerPoints into contentMarkers
* Rename viewtype constant and move toggle viewtype logic into skin rather than button
* Update exposureSDK-version
* Update marker constants to specific start and stop events
* Use locale option from player settings
* WIP add skip segment button
* WIP! remove use of waitForAnimationToFinish in fullskin.tsx

Bug Fixes

* Amend PR-comments
* Build not working
* Fixed typo
* Fixup! remove mute on start
* Fixup! rename components related to contentMarkers from cuePoints to contentMarkers
* Remove end time from contentmarkers to align look on contentmarkermenu
* Remove onHover events on menu buttons
* Remove unused file waitForAnimationToFinish
* Rename useAnimation to useWaitForAnimationToFinish
* Set contentMarkers in AssetPlayer
* Set initital visible state to false

**v0.35.0** (2021-09-20)

Features

* Add support for encrypted SSAI
* Add support for retaining cast session between players & casting mp4
* Support playlist when airplaying

**v0.34.0** (2021-09-14)

Features

* Save last used languages & update dashjs

Bug Fixes

* CastConnector sending in bitrate incorrectly
* SeekTo 0 not working

**v0.33.0** (2021-09-07)

Features

* Support trailing slash in exposure base url
* Mdi-preact for all material icons

Bug Fixes

* Complete tracking not happening consistently
* Include fps in quality level name when applicable

**v0.32.5** (2021-09-03)

Bug Fixes

* Skipping watched ad-break looping

**v0.32.4** (2021-08-27)

Bug Fixes

* STB detection being case-sensitive

**v0.32.3** (2021-08-27)

Bug Fixes

* Ad impression not being tracked on older devices

**v0.32.2** (2021-08-27)

Bug Fixes

* Partilly supported videoElement API always being used

**v0.32.1** (2021-08-25)

Bug Fixes

* Embedded player crashing

**v0.32.0** (2021-08-25)

Features

* Support time & change seeking in the skin
* Validate keysystem before attempting to use it

**v0.32.0-alpha.1** (2021-08-23)

Bug Fixes

* Admonitor not being destroyed with the adinsertionplayer

**v0.32.0-alpha.0** (2021-08-23)

Features

* SSAI VOD Support

Bug Fixes

* Improve detection of iframe hostname

**v0.31.1** (2021-08-20)

Bug Fixes

* Enriching domain failing in iframe

**v0.31.0** (2021-08-20)

Features

* Bundle types
* Detect bitrate in native engine
* Adobe primetime auth
* Advanced web components settings
* Airplay analytics
* Add default fields to all events, inc. player & device
* Audio only mode
* Dashjs support
* Dispatch events in batches, fix analytics not cleaned up
* Dropped frames and buffering events in exposed state data
* Dynamic analytics base url as option
* Enriched ads options for dynamic ad insertion
* External id support, as alternative to asset id
* Hover effect on skin buttons
* Init option to decide keysystem override
* Logger class
* Metadata image as poster when no autoplay
* Podcast support
* Poster support
* Quality selector
* Remove analytics as an optional module, it's required.
* Rename modules & move airplay to core module
* Skin icons for jumping back and forth 30 sec
* Stop on error, ignore all recoverable shaka errors.
* Support for sprite offset
* Support multiple audio and subtitle tracks per language
* Track autoplay in analytics
* Update CastSender to use CAF Receiver
* Update exposure-sdk with breaking change
* Update hls.js to 1.0.0
* Update hls.js to 1.0.2
* Update shaka to 2.5.21
* Wallclock timeline
* Web component starttime support

Bug Fixes

* Add entry animation delay on skin
* Add missing support for `source` to playlist
* Added analytics fields according to updated spec
* Added playToken as an optional init option
* Adjust to new method name for onNow
* AdParameters not being passed to cast receiver
* AnalyticsBucket used wrong data due to typo
* Avoid multiple qualities when we have 2+ audio tracks with same language
* Better skd check in native player
* Bump sdk to version with breaking change + fix breaks
* CastSenderCAF not being destroyed due to reference error
* CastSTate not updating on init
* Change jump offset to 10 seconds
* Desktop should always use full skin
* Destroy throwing errors
* Dev page set source to player options when provided
* Disable HEVC if the decoder can't initialize
* Disable program service when single event channel is detected
* Don't pause on single tap for touch devices
* Dynamic analytics base url in web component
* Events not cleaned up, cast session not killed on player killed
* Fairplay errors
* Hide scrollbar in skin metadata
* Huawei phones not playing DRM
* Ignore supported formats list for custom keysystem request
* IsSeekable not working correctly for live content
* LicenseUrl in Fairplay skd
* Minor change to main readme
* Minor visual fix on volume slider
* Moved analytics base url to be set on init
* Ms-edge android not working due to mediaSession throwing errors
* Native engine not using typescript, cleanup
* NativeName of languages not starting upper-case
* Only create ITrack when there is a track
* Override supportedKeySystem when sending in a custom one
* Player crashing if ResizeObserver doesn't exist
* Player not going to ended state on ended
* Player stopped before sending end event causing broken analytics
* Playlist not using the `source` field
* Prefix error if from a non maintained device
* Quality control color
* RedBeePlayer not destroying listeners
* Remove ')' text
* Remove forced https dev page
* Require a sessionId to run analytics
* ResizeObserver rather than window resize for Shaka level cap
* Safari throwing errors when stopping
* Set audio track by raw label in shaka
* Shaka cap to follow contract restrictions
* Shaka emitting loaded event to soon
* Shaka fetch presentation time from audio variant when no video
* Shaka not emitting error event during startup
* Shaka-player being bundled
* Show progressbar when no contract rerstriction exist
* Show skin on touch
* Simplified CP player alt on demo page
* Skin settings as optional sdk contructor parameter
* Skin settings to hide quality control and jump buttons
* Smaller metadata image & area
* Sprites not working
* Throw error if it's a drm asset though no key system support found
* Upgrade web component for the new player sdk interface
* Utc timings not set onLoaded
* Web component dispatch player instance

**v0.12.0** (2021-03-02)

Features

* Add bundleable SDK
* Add cast support
* Add CastConnector to analytics, add support for new CastReceiver
* Add disable cast option
* Add mobile skin
* Add npm version of web-component
* Add onSkinHidden/onSkinVisible
* Add optional fullscreen element
* Add picture-in-picture support
* Add player-skin
* Add support for audioTracks in the HlsJs engine.
* Add support for https in the development page
* Add thumbnail when hoving progressbar
* Add types to package.json
* Add UTC time support
* Support for ad analytics events
* Add new.css to make the demo site prettier
* Detect change of asset id and load new asset on chromecast
* Drm analytics
* Expose toggle muted method on player
* Human readable vod duration in metadata overlay
* Ignore startTime if it's over 95% played
* Implement playPauseStop instead of playPause button
* Improve configuration for shaka live
* Improve the visibility toggle of the volume slider
* Keyboard shortcuts
* Program-service
* Progressbar design improvements
* Remove un-used and broken changelogs
* Rename scope to @redbeemedia
* Revert scope name change
* SeekToLive method for live
* Set max resolution of level playing to element size in Shaka
* Set playbackRate method
* SSAI Step 1
* SSAI support
* Support multiple sprite sizes
* Support setting env using queryParameters
* Update engines
* Update settings-menu layout to differn depending on player width
* Use microbundle version 0.12.4

Bug Fixes

* 500 as fallback error code in safari
* Ability to send in playerName and playerVersion into analytics
* Acknowledge debug throughout the entire analytics implementation
* Add external_modules to files
* Add missing exports
* Add missing type export `ISpriteCue`
* AdStitchEngine not destroyed with AdMonitor
* Analytics not supporting different device models
* Audio settings showing when there is no options
* Auto generate deviceId if not provided
* Autoplay check not considering muted option
* Autoplay sent to analytics
* Better error data
* Block multiple on now calls during ongoing requests
* Block seekablitiy in live hls.js if small window
* Cast not loading new asset if previous asset was ended
* Cast not resuming if switching player instances in SPA
* Change autoplay
* Changed heartbeat interval to 60 second
* Fix CI not working when not all packages will be published
* Cleanup player & skin & sdk more properly
* Cors issues when sending send & forget impressions
* CurrentTime, duration, seekable being invalid before start
* Dev mode not working due to VERSION not being ignored if it isn't defined
* Don't expose SDK types until all modules are available in npm
* Edge 18 playback not working
* End analytics session on error and ended
* Engine should emit EngineEvents not PlayerEvents
* ExitPiP spam on destroy
* Export generated deviceId from ExposureService in auth response
* Exposing player version from js-player into analytics
* ExposureService not getting httpCodes as error code
* ExposureService not throwing errors if JSON is OK
* Failing import
* Fairplay not working
* Fairplay token typo
* FallbackUTCTime not correctly removing duration in ms from Date.now()
* Fix broken handling of starttime on load
* Fix deviceId being dependent on exposureService
* Fix margin being wrong in live mode
* Further distance between heartbeats
* Hide imageWrapper in skin, when no image exist
* HideControlsTimer not having a default setting
* If already paused, do not trigger another one
* If no program response in on now, return
* Improve metadata component
* Improve metadataView in _most_ scenarios
* Improve the touch experience
* Improved error parsing Shaka
* Include 500 in native ErrorMap as we have it as fallback
* IsFullscreen returning true if fs was exited using browser shortcuts
* Kill level earlier with dropped frames in hls.js
* Loader not visible when skin is hidden
* Make style.css available at top level
* MediaSessionManager localized object parsing improvements
* Metadata skin minor design adjustments for mobile
* Minor metadata image size bug in safari
* Minor style change live button
* Mobile skin not showing before playback have started
* More proper log in not entitled scenario
* Null check on localizedMetadata in MediaSessionManager
* Null check whether therre exist a shaka instance on cap lecel to player size
* Parse deviceId from sessionToken
* Player container not having a dark background
* Player going in to fullscreen on iOS when autoplay: true
* Player not resuming at the right time when cast is stopped.
* Player throwing type error when program has no image
* Possible to set/not set debug mode for analytics in sdk
* Ignore invalid pings
* Remove the check for whether drm request had already been made
* Removed debug console log
* Responsetype arraybuffer for irdeto fairplay license
* Return on undefined program ends datetime in channel program service
* Rounded seconds in human readale time string
* Safari getting stuck in buffering
* Safari not sending pause event
* Send in assetId to analytics
* Send in assetId with error in analytics
* Set a full state by default
* Set default font-size to prevent invalid conf by implementor
* Set isMuted based on the volumechange event, not on a method call
* Set muted correct and update the state during playback
* Shaka error simplification
* Shaka not playing finished live events, fix seekTo not clamping to seekable
* Thresholds for level capping in Shaka
* Throwing error on Safari decryption error
* Tizen TV being detected as Safari
* Treat events as optional
* Trigger play after airplay screen change
* Type error
* Typo in allowPictureInPicture
* Update css name
* User active callbacks not firing
* Username and password optional for authentication, going into anonymous if non existent
* Using warn instead of error when init cast fails
* Version number being hardcoded
* Workflow not triggering

