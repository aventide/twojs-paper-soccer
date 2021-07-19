import {
  NUMBER_PITCH_COLS,
  NUMBER_PITCH_ROWS,
} from "./constants";

import { createGame } from './core';

import {
  renderGame,
} from './renderers'

// function getAppDimensions() {
//   const { innerWidth, innerHeight } = window;
//   // in the future, let's probably just display a "height is too small" message in css
//   if (innerWidth <= 440) {
//     if (innerHeight >= innerWidth) {
//       return [innerWidth, innerWidth * 1.25]
//     } else {
//       return [innerHeight, innerHeight * 0.8];
//     }
//   } else {
//     return [DEFAULT_PITCH_DIMENSIONS.width, DEFAULT_PITCH_DIMENSIONS.height]
//   }
// }

function createHeader() {

  const PADDING = game.edgeLength;

  const headerAnchorPoint = {
    x: PADDING ,
    y: 0,
  };

  const headerEndPoint = {
    x: game.appWidth - PADDING,
    y: PADDING * 2,
  };

  return {
    anchor: { ...headerAnchorPoint },
    end: { ...headerEndPoint },
  };
}

function createPitch() {
  const PADDING = game.edgeLength;
  const pitchAnchorPoint = {
    x: PADDING,
    y: PADDING * 2,
  };

  const pitchEndPoint = {
    x: game.appWidth - PADDING,
    y: game.appHeight - (PADDING * 2),
  };

  return {
    anchor: { ...pitchAnchorPoint },
    end: { ...pitchEndPoint },
  };
}

function createFooter() {

  const {appWidth, appHeight, edgeLength} = game;
  const PADDING = edgeLength;

  const footerAnchorPoint = {
    x: PADDING ,
    y: appHeight - (3 * edgeLength),
  };

  const footerEndPoint = {
    x: appWidth - PADDING,
    y: appHeight
  };

  return {
    anchor: { ...footerAnchorPoint },
    end: { ...footerEndPoint },
  };
}

// ENTRY POINT

// create the game
const game = createGame();
const { two } = game;

// get base things like edgeLength and app dimensions
// const [appWidth, appHeight] = getAppDimensions();

// total app height - this will be the pitch plus menus
// this really gets total number of squares
const appCols = (NUMBER_PITCH_COLS + 2);
const appRows = (NUMBER_PITCH_ROWS + 2 + 2);

// set some dynamically-generated game dimensions
game.edgeLength = 50;
game.appWidth = appCols * game.edgeLength;
game.appHeight = appRows * game.edgeLength;

two.width = game.appWidth;
two.height = game.appHeight;

game.views.header = createHeader();
game.views.pitch = createPitch()
game.views.footer = createFooter();

// start off with the first render of the pitch
renderGame(game);

two.bind('update', function (frameCount) {

  let newRingOpacity = game.handles.currentPositionOpacity;
  let direction = game.handles.direction || 1;

  if (direction === 1) {
    if (newRingOpacity < 1) {
      newRingOpacity += 0.01 * direction;
    } else {
      direction = -1;
      newRingOpacity = 0.99
    }
  } else {
    if (newRingOpacity > 0.3) {
      newRingOpacity += 0.01 * direction;
    } else {
      direction = 1;
    }
  }

  game.handles.currentPositionOpacity = newRingOpacity;
  if (game.handles.currentPositionRing) {
    game.handles.currentPositionRing.opacity = newRingOpacity;
  }
  game.handles.direction = direction;
}).play()

const debouncedRenderGame = debounce(() => renderGame(game))

// Global window stuff
window.addEventListener("resize", function () {
  debouncedRenderGame()
});

function debounce(func, timeout = 1000){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}
