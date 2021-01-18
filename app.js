import {
  NUMBER_COLS,
  DEFAULT_PADDING_X,
  DEFAULT_PADDING_Y,
  DEFAULT_PITCH_DIMENSIONS,
  INFO_PRIMARY,
  PLAYER_ONE,
} from "./constants";

import { loadCore } from './core';

import {
  renderGraphPaper,
  renderPitchBorders,
  renderStartDot,
  renderPlayerGraphics,
} from './renderers'

// Global window stuff
window.addEventListener("resize", function () {
  drawResponsivePitch();
});

function drawResponsivePitch() {
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

  // make function that defines a box within the canvas
  // so create the box, assign it to a handle, and then apply drawPitch() and drawGraphPaper() to that box

  // we'll need a translation function to offset stuff that happens in the boxes vs the main canvas

  // at this point, we need to calculate the actual drawable area

  const pitchAnchorPoint = {
    x: DEFAULT_PADDING_X,
    y: DEFAULT_PADDING_Y,
  };

  const pitchEndPoint = {
    x: two.width - DEFAULT_PADDING_X,
    y: two.height - DEFAULT_PADDING_Y,
  };

  game.boxes.pitch = {
    anchor: { ...pitchAnchorPoint },
    end: { ...pitchEndPoint },
  };

  drawPitch(game.boxes.pitch);
  drawActiveTurnPerson();
}

// ENTRY POINT

// create the game
const game = loadCore();
const { two } = game;

// start off with the first render of the pitch
drawResponsivePitch();

function drawPitch(pitch) {
  // this might be an ugly float, but seems to be fine for now...
  const edgeLength = (pitch.end.x - pitch.anchor.x) / NUMBER_COLS;

  // @todo is this necessary?
  two.clear();

  // do we really need both of these args though? They seem really global...refactor this later, you asshole.
  game.handles.graphPaper = renderGraphPaper(game.two, pitch, edgeLength);
  game.handles.pitchBorders = renderPitchBorders(game.two, pitch, edgeLength);
  game.handles.startPositionDot = renderStartDot(game.two, pitch, edgeLength);
  renderPlayerGraphics(game, edgeLength);
}

function drawInfo(element, text) {
  const InfoPanelIdMap = {
    [INFO_PRIMARY]: "turn",
  };

  const drawElem = document.querySelector(`#${InfoPanelIdMap[element]}`);
  drawElem.innerText = text;
}

function drawActiveTurnPerson(isBouncing) {
  const statusText =
    (game.model.turnFor === PLAYER_ONE ? "Player 1" : "Player 2") +
    (isBouncing ? ", go again now!" : "");
  drawInfo(INFO_PRIMARY, statusText);
}
