<!--
SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>

SPDX-License-Identifier: CC-BY-SA-4.0
-->

# Development

Development page for the RedBeeMedia JavaScript Player.

## Instructions

Run `npm run dev` from the repository root to start the page, and open <http://127.0.0.1:1234/> in your browser (localhost, 0.0.0.0 and 192.168.x.x works too, but casting from those might not work, see the cast-receiver repo for details).

The page remembers your past choices and will store them in local storage to suggest for you next time, (so you want to stick to one address to access it from locally, or it will not be able to access your old usage).

The suggestions are contextual, so it will not suggest assets for a different customer / businessUnit than you currently have selected.

If you have no customer or businessUnit filled in, then you can only play source assets (URLs), and it will suggest your previously played source assets.

## Debugging Analytics

If you toggle "Send analytics", it will send analytics to the analytics server, which is good for testing the full client-server integration, but for normal testing, you don't want to do that, and should have this box unchecked.

When you have the box unchecked it will run analytics in debug mode which logs in the console what it would send if it wasn't in debug mode.

## Debugging the player

The RedBeePlayer instance is saved to a global variable `player`, which you can access in the browser developer tools console.

## Customer Portal player

The Red Bee Media customer portal has an integration with the player which authenticates on the server side instead of the client side. To ensure that we don't break compatibility with this behavior, we have set up a test that works the same way here called the "Portal player".
