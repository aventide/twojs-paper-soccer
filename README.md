# TWOJS-PAPER-SOCCER

## Concept

The game of paper soccer, usually played IRL on graph paper. Except this time, played in a web browser using [two.js](https://two.js.org/)

## Development

### Setup:

yarn install
yarn start

See 'Possible Issues' below if running on Apple Silicon machines causes issues

## Code elements

### Rules

Functions that return game state based on conditions present on the game object, or conditions present in a temporary object
these rule functions will come in handy when it's time to do server-side validation of game moves

### Renderer - a function that draws graphics to the two.js canvas based on existing game state.

Routines, meaning that they function by having side effects. They could have a return value that is a status, if need be.

renderers need to know the following values to work:

1. anchorpoint, to know where to draw
2. edgeLength, to handle responsiveness
3. access to game state, to know what objects to draw and where

(Currently, renderers all have access to the gloabl game object)

So renderer functions in this game can assume they recieve these params:
```
anchor: {x, y}
edgeLength: x
state: {
    ...state generating functions, aka rules.
}
```
## Game Lifecycle

1. Initial config

   - Mobile detection
   - Dimensions
   - Game model starting values
   - Assign Rendering functions

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
   - Determine if the player's turn has ended.x

4. Victory has been reached
   - Record the victory (TBD - stub this for now)
   - Display victory graphic of some sort.
   - Allow player to start a new game.


## Style

Main colors (as the game as two players)
Deep orange (#EE7600)
Mediun Purple (#9370DB)
## Possible Issues on ARM:

// node_modules/puppeteer-core/lib/cjs/puppeteer/node/Launcher.js L:73
if (os.arch() === 'arm64' && false) {
    chromeExecutable = '/usr/bin/chromium-browser';
}