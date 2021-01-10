# TWOJS-PAPER-SOCCER

## Concept

The game of paper soccer, usually played IRL on graph paper. Except this time, played in a web browser using [two.js](https://two.js.org/)

## Development

### Setup:

yarn install
yarn start

See 'Possible Issues' below if running on Apple Silicon machines causes issues
## Game Lifecycle

1. Initial config

   - Mobile detection
   - Dimensions
   - Game model starting values

2. Draw permanent graphics

   - Pitch Edges
   - Graph paper
   - Starting position
     - includes drawing movement dots for the first time

3. Click-Eval-Redraw (LOOP via click handlers)

   - Player starts or continues their turn
   - Player clicks on an open vertex (point)
     - point and associated edges are registered in the game model
   - Render path with new edge added.
     - Includes drawing all the edges as well as redrawing movement dots
   - Determine whether a victory is reached.
     - If so, remove movement dots and then see (4) below
   - Determine if the player's turn has ended.

4. Victory has been reached
   - Record the victory (TBD - stub this for now)
   - Display victory graphic of some sort.
   - Allow player to start a new game.

## Possible Issues:

// node_modules/puppeteer-core/lib/cjs/puppeteer/node/Launcher.js L:73
if (os.arch() === 'arm64' && false) {
    chromeExecutable = '/usr/bin/chromium-browser';
}