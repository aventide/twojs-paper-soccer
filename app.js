import mobilecheck from "./util/mobilecheck";
import {
  NUMBER_ROWS,
  NUMBER_COLS,
  DEFAULT_PADDING_X,
  DEFAULT_PADDING_Y,
  DEFAULT_CONFIG,
  INITIAL_GAME_MODEL,
} from "./constants";

import { drawStartDot, drawMoveableSpots, drawCurrentSpot } from "./drawDots";

import { assignInputHandlers } from "./input";

game.routines.drawLinePath = (points, edgeLength) => {
  if (!points || !points.length) {
    return;
  }

  const { anchor } = game.boxes.pitch;

  // scale up distances between points
  const renderablePoints = points.map((p) => ({
    x: anchor.x + p.x * edgeLength,
    y: anchor.y + p.y * edgeLength,
  }));

  let currentPoint;
  let nextPoint;

  for (let i in renderablePoints) {
    currentPoint = renderablePoints[Number(i)];
    nextPoint = renderablePoints[Number(i) + 1];
    if (nextPoint) {
      const segment = two.makeLine(
        currentPoint.x,
        currentPoint.y,
        nextPoint.x,
        nextPoint.y
      );
      segment.stroke = "black";
      segment.linewidth = 2;
    }
  }

  two.update();
};

const isMobile = mobilecheck();
if (isMobile) {
  alert("Mobile Device Detected.");
}

window.addEventListener("resize", function () {
  drawResponsivePitch();
});

// DOM stuff for Two.js
const appElem = document.getElementById("app");
const two = new Two(DEFAULT_CONFIG);
two.appendTo(appElem);

// game state: whose turn it is, whether turn is complete (any possible moves left), path in current turn (if enabled), whether game is won and who won
const game = {
  ...INITIAL_GAME_MODEL,
  twoInstance: two,
};

function drawResponsivePitch() {
  const { innerWidth, innerHeight } = window;

  // in the future, let's probably just display a "height is too small" message in css
  if (innerWidth <= 700 || isMobile) {
    if (innerHeight >= innerWidth) {
      two.width = innerWidth;
      two.height = innerWidth * 1.25;
    } else {
      two.height = innerHeight;
      two.width = innerHeight * 0.8;
    }
  } else {
    two.width = DEFAULT_CONFIG.width;
    two.height = DEFAULT_CONFIG.height;
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
}

drawResponsivePitch();

function drawPitch(pitch) {
  // this might be an ugly float, but seems to be fine for now...
  // @todo consolidate edgelength?
  const edgeLength = (pitch.end.x - pitch.anchor.x) / NUMBER_COLS;

  two.clear();

  // @TODO start adapting here, using the pitch argument
  // do we really need both of these args though? They seem really global...refactor this later, you asshole.
  game.handles.graphPaper = drawGraphPaper(pitch, edgeLength);
  game.handles.pitchBorders = drawPitchBorders(pitch, edgeLength);
  game.handles.startPositionDot = drawStartDot(game, pitch, edgeLength);

  game.routines.drawLinePath(game.model.pointList, edgeLength);
  drawMovementDots(game);
}

function drawGraphPaper(box, edgeLength) {
  const lines = [];

  const { anchor, end } = box;

  for (let x = 0; x <= NUMBER_ROWS; x++) {
    const line = two.makeLine(
      anchor.x,
      anchor.y + x * edgeLength,
      end.x,
      anchor.y + x * edgeLength
    );
    line.stroke = "lightblue";
    lines.push(lines);
  }
  for (let y = 0; y <= NUMBER_COLS; y++) {
    const line = two.makeLine(
      anchor.x + y * edgeLength,
      anchor.y,
      anchor.x + y * edgeLength,
      end.y
    );
    line.stroke = "lightblue";
    lines.push(lines);
  }

  return lines;
}

function drawPitchBorders(box, edgeLength) {
  const segments = [];
  const { anchor, end } = box;

  // get horizontal center
  const centerpointX = (end.x + anchor.x) / 2;

  // get half-height
  const heightBound = end.y;
  // draw goal ends
  segments.push(
    // top end

    two.makeLine(
      centerpointX - edgeLength,
      anchor.y,
      centerpointX + edgeLength,
      anchor.y
    ),
    two.makeLine(
      centerpointX - edgeLength,
      anchor.y,
      centerpointX - edgeLength,
      anchor.y + edgeLength
    ),
    two.makeLine(
      centerpointX + edgeLength,
      anchor.y,
      centerpointX + edgeLength,
      anchor.y + edgeLength
    ),

    two.makeLine(
      centerpointX - edgeLength,
      anchor.y + edgeLength,
      anchor.x,
      anchor.y + edgeLength
    ),
    two.makeLine(
      centerpointX + edgeLength,
      anchor.y + edgeLength,
      end.x,
      anchor.y + edgeLength
    ),

    // bottom end

    two.makeLine(
      centerpointX - edgeLength,
      heightBound,
      centerpointX + edgeLength,
      heightBound
    ),
    two.makeLine(
      centerpointX - edgeLength,
      heightBound,
      centerpointX - edgeLength,
      heightBound - edgeLength
    ),
    two.makeLine(
      centerpointX + edgeLength,
      heightBound,
      centerpointX + edgeLength,
      heightBound - edgeLength
    ),

    two.makeLine(
      centerpointX - edgeLength,
      heightBound - edgeLength,
      anchor.x,
      heightBound - edgeLength
    ),
    two.makeLine(
      centerpointX + edgeLength,
      heightBound - edgeLength,
      end.x,
      heightBound - edgeLength
    ),

    // sides

    two.makeLine(anchor.x, anchor.y + edgeLength, anchor.x, end.y - edgeLength),
    two.makeLine(end.x, anchor.y + edgeLength, end.x, end.y - edgeLength)
  );

  segments.forEach((s) => (s.linewidth = 3));
  return segments;
}

function drawMovementDots(game) {
  const currentPoint = game.model.pointList[game.model.pointList.length - 1];

  const { pitch } = game.boxes;

  // @todo consolidate edgelength?
  const edgeLength = (pitch.end.x - pitch.anchor.x) / NUMBER_COLS;

  drawMoveableSpots(game, currentPoint, edgeLength, assignInputHandlers);
  drawCurrentSpot(game, currentPoint, edgeLength);

  two.update();
}

function handleVictoryCondition(point) {
  // make sure this is legal

  // test for player 1 victory
  if (point.y <= 0) {
    game.model.winner = "1";
    // test for player 2 victory
  } else if (point.y >= NUMBER_ROWS) {
    game.model.winner = "2";
  }
}
