import {
  NUMBER_COLS,
  DEFAULT_PADDING_X,
  DEFAULT_PADDING_Y,
  DEFAULT_PITCH_DIMENSIONS,
  INFO_PRIMARY,
  PLAYER_ONE,
} from "./constants";

import { loadCore } from './core';

import { getCoordKey } from "./util";
import { getLegalMoves, getVictoryState, getWhoseTurn } from './rules';
import {
  renderGraphPaper,
  renderPitchBorders,
  renderStartDot,
  renderLinePath
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
  renderPlayerGraphics(edgeLength);
}



function eraseMoveableSpots() {
  two.remove(game.handles.moveableSpots);
}

function drawMoveableSpots(edgeLength) {
  const radius = edgeLength / 8;
  const currentPoint = game.model.pointList[game.model.pointList.length - 1];
  const points = getLegalMoves(currentPoint, game.model.edgeMap);

  const renderedPoints = [];
  const { anchor } = game.boxes.pitch;
  points.forEach(point => {
    renderedPoints.push(two.makeCircle(
      anchor.x + point.x * edgeLength,
      anchor.y + point.y * edgeLength,
      radius
    ))
  });

  two.update();

  renderedPoints.forEach((p) => {
    p._renderer.elem.addEventListener("mouseover", function () {
      p.fill = "lightblue";
      p.opacity = 0.6;
      two.update();
    });
    p._renderer.elem.addEventListener("mouseout", function () {
      p.fill = "white";
      p.opacity = 1;
      two.update();
    });

    // @todo this click leads to a major game state check. Consider making that routine a callback
    p._renderer.elem.addEventListener("click", function () {
      const { anchor } = game.boxes.pitch;
      const lastPoint = game.model.pointList[game.model.pointList.length - 1];

      // @todo ew, we really should use the raw point values, then rendering.
      const newPoint = {
        x: (p._translation.x - anchor.x) / edgeLength,
        y: (p.translation.y - anchor.y) / edgeLength,
      };

      // @todo is this necessary, really?
      // really make sure that no one has won yet.
      if (game.model.winner) {
        return;
      }

      game.model.winner = getVictoryState(newPoint);
      game.model.turnFor = getWhoseTurn(newPoint, game.model.turnFor, game.model.pointList);
      drawActiveTurnPerson(game.model.isBouncing);

      const lastPointKey = getCoordKey(lastPoint);
      const newPointKey = getCoordKey(newPoint);

      game.model.pointList.push(newPoint);
      if (
        game.model.edgeMap[newPointKey] &&
        game.model.edgeMap[newPointKey].length
      ) {
        game.model.edgeMap[newPointKey].push(lastPointKey);
        game.model.edgeMap[lastPointKey].push(newPointKey);
      } else {
        game.model.edgeMap[newPointKey] = [lastPointKey];
        game.model.edgeMap[lastPointKey].push(newPointKey);
      }

      renderPlayerGraphics(edgeLength);
    });
  });

  // remove old circles from the pitch
  eraseMoveableSpots();
  game.handles.moveableSpots = [...renderedPoints];
}

function drawCurrentSpot(currentPoint, edgeLength) {
  const { anchor } = game.boxes.pitch;
  two.remove(game.handles.currentPositionDot);
  game.handles.currentPositionDot = two.makeCircle(
    anchor.x + currentPoint.x * edgeLength,
    anchor.y + currentPoint.y * edgeLength,
    edgeLength / 5
  );
  game.handles.currentPositionDot.fill = "yellow";
}

function renderPlayerGraphics(edgeLength) {
  const currentPoint = game.model.pointList[game.model.pointList.length - 1];
  renderLinePath(game.two, game.boxes.pitch, edgeLength,  game.model.pointList);
  drawCurrentSpot(currentPoint, edgeLength);

  if (!!game.model.winner) {
    eraseMoveableSpots();
    drawInfo(INFO_PRIMARY, `Player ${game.model.winner} wins the game!`);
    two.update();
  } else {
    drawMoveableSpots(edgeLength);
  }
  two.update();
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
