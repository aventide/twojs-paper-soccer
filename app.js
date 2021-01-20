import {
  DEFAULT_PADDING_X,
  DEFAULT_PADDING_Y,
  DEFAULT_PITCH_DIMENSIONS,
  INFO_PRIMARY,
  PLAYER_ONE,
} from "./constants";

import { loadCore } from './core';

import {
  renderPitch
} from './renderers'

function createPitch() {
  const { innerWidth, innerHeight } = window;

  // in the future, let's probably just display a "height is too small" message in css
  if (innerWidth <= 440) {
    if (innerHeight >= innerWidth) {
      two.width = innerWidth;
      two.height = innerWidth * 1.25;
    } else {
      two.height = innerHeight;
      two.width = innerHeight * 0.8;
    }
  } else {
    two.width = DEFAULT_PITCH_DIMENSIONS.width;
    two.height = DEFAULT_PITCH_DIMENSIONS.height;
  }

  const pitchAnchorPoint = {
    x: DEFAULT_PADDING_X,
    y: DEFAULT_PADDING_Y,
  };

  const pitchEndPoint = {
    x: two.width - DEFAULT_PADDING_X,
    y: two.height - DEFAULT_PADDING_Y,
  };

  return {
    anchor: { ...pitchAnchorPoint },
    end: { ...pitchEndPoint },
  };
}

// ENTRY POINT

// create the game
const game = loadCore();
const { two } = game;

// start off with the first render of the pitch
game.boxes.pitch = createPitch();
renderPitch(game);

// Global window stuff
window.addEventListener("resize", function () {
  game.boxes.pitch = createPitch();
  renderPitch(game);
});
