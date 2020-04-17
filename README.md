# TWOJS-PAPER-SOCCER

## Concept

The game of paper soccer, usually played IRL on graph paper. Except this time, played in a web browser using [two.js](https://two.js.org/)

## Development

This project uses [parcel-bundler]() to bundle internal dependencies and transpile.

### Setup:

1. Install `parcel-bundler` and `node-sass` from npm. Keep in mind that node-sass should be installed locally.

2. Run `parcel index.html`.

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
   - (If AI, decide a move based on intelligence level)

4. Victory has been reached
   - Record the victory (TBD - stub this for now)
   - Display victory graphic of some sort.
   - Allow player to start a new game.
