import {
  NUMBER_ROWS,
  NUMBER_COLS,
  DEFAULT_PADDING_X,
  DEFAULT_PADDING_Y,
  DEFAULT_CONFIG,
  INITIAL_GAME_MODEL,
  PLAYER_ONE,
  PLAYER_TWO,
  INFO_PRIMARY,
} from "./constants";

import { getCoordKey, areCoordsEqual, getPitchEdges, mobilecheck } from "./util";

const isMobile = mobilecheck();
if (isMobile) {
  // alert("Mobile Device Detected.");
}

window.addEventListener("resize", function () {
  drawResponsivePitch();
});

// DOM stuff for Two.js
const appElem = document.getElementById("app");
const two = new Two(DEFAULT_CONFIG);
two.appendTo(appElem);

// boxes: subdvisions of the main canvas specific for this game. Used for placement of main elements
// model: effective state to base rendering from
// handles: references to two.js objects after creation, so they can be deleted or manipulated. May not include objects that never need manipulation.

// game state: whose turn it is, whether turn is complete (any possible moves left), path in current turn (if enabled), whether game is won and who won
const game = {
  ...INITIAL_GAME_MODEL,
};

function drawResponsivePitch() {
  const { innerWidth, innerHeight } = window;

  // in the future, let's probably just display a "height is too small" message in css
  if (innerWidth <= 440 || isMobile) {
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

  drawActiveTurnPerson();
}

drawResponsivePitch();

function drawPitch(pitch) {
  // this might be an ugly float, but seems to be fine for now...
  const edgeLength = (pitch.end.x - pitch.anchor.x) / NUMBER_COLS;

  // @todo is this necessary?
  two.clear();

  // do we really need both of these args though? They seem really global...refactor this later, you asshole.
  game.handles.graphPaper = drawGraphPaper(pitch, edgeLength);
  game.handles.pitchBorders = drawPitchBorders(pitch, edgeLength);
  game.handles.startPositionDot = drawStartDot(pitch, edgeLength);
  renderPlayerGraphics(edgeLength);
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

function getCenterPoint() {
  return {
    x: NUMBER_COLS / 2,
    y: NUMBER_ROWS / 2,
  };
}

function drawPitchBorders(box, edgeLength) {
  const { anchor, end } = box;

  // get horizontal center
  const centerpointX = (end.x + anchor.x) / 2;

  // get half-height
  const heightBound = end.y;
  // draw goal ends
  const segments = [
    // top end

    [
      centerpointX - edgeLength,
      anchor.y,
      centerpointX + edgeLength,
      anchor.y
    ],
    [
      centerpointX - edgeLength,
      anchor.y,
      centerpointX - edgeLength,
      anchor.y + edgeLength
    ],
    [
      centerpointX + edgeLength,
      anchor.y,
      centerpointX + edgeLength,
      anchor.y + edgeLength
    ],

    [
      centerpointX - edgeLength,
      anchor.y + edgeLength,
      anchor.x,
      anchor.y + edgeLength
    ],
    [
      centerpointX + edgeLength,
      anchor.y + edgeLength,
      end.x,
      anchor.y + edgeLength
    ],

    // bottom end

    [
      centerpointX - edgeLength,
      heightBound,
      centerpointX + edgeLength,
      heightBound
    ],
    [
      centerpointX - edgeLength,
      heightBound,
      centerpointX - edgeLength,
      heightBound - edgeLength
    ],
    [
      centerpointX + edgeLength,
      heightBound,
      centerpointX + edgeLength,
      heightBound - edgeLength
    ],

    [
      centerpointX - edgeLength,
      heightBound - edgeLength,
      anchor.x,
      heightBound - edgeLength
    ],
    [
      centerpointX + edgeLength,
      heightBound - edgeLength,
      end.x,
      heightBound - edgeLength
    ],

    // sides

    [anchor.x, anchor.y + edgeLength, anchor.x, end.y - edgeLength],
    [end.x, anchor.y + edgeLength, end.x, end.y - edgeLength]
  ];

  const handles = segments.map(s => two.makeLine(s[0], s[1], s[2], s[3]))
  handles.forEach((s) => (s.linewidth = 3));
  return handles;
}

function drawStartDot(box, edgeLength) {
  const point = getCenterPoint(edgeLength);
  const { anchor } = box;

  const renderablePoint = {
    x: anchor.x + point.x * edgeLength,
    y: anchor.y + point.y * edgeLength,
  };

  const dot = two.makeCircle(renderablePoint.x, renderablePoint.y, 8);
  dot.fill = "black";

  return dot;
}

function drawLinePath(points, edgeLength) {
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
}

function eraseMoveableSpots() {
  two.remove(game.handles.moveableSpots);
}

function getLegalMoves(currentPoint) {

  // the points one unit in all directions around current point
  const possibleMovePoints = [
    { x: currentPoint.x - 1, y: currentPoint.y },
    { x: currentPoint.x + 1, y: currentPoint.y },
    { x: currentPoint.x, y: currentPoint.y - 1 },
    { x: currentPoint.x, y: currentPoint.y + 1 },
    { x: currentPoint.x - 1, y: currentPoint.y - 1 },
    { x: currentPoint.x - 1, y: currentPoint.y + 1 },
    { x: currentPoint.x + 1, y: currentPoint.y + 1 },
    { x: currentPoint.x + 1, y: currentPoint.y - 1 }
  ];

  const legalMovePoints = possibleMovePoints.filter(point => {

    const heightBound = NUMBER_ROWS;
    const widthBound = NUMBER_COLS;
    const centerpointX = widthBound / 2;
    const key = getCoordKey({ x: point.x, y: point.y });
    const compare = game.model.edgeMap[key];

    const isPointBouncingOffSideWalls = (currentPoint.x > 0 || point.x > 0) && (currentPoint.x < widthBound || point.x < widthBound)

    const isPointBouncingOffTopWall = currentPoint.y > 1 || (point.y === 0 ? (
      (currentPoint.x === centerpointX) ||
      (currentPoint.x === centerpointX - 1 || currentPoint.x === centerpointX + 1) && point.x === centerpointX
    ) : (
        (point.y > 1) ||
        point.x === centerpointX ||
        currentPoint.x === centerpointX
      ))

    const isPointBouncingOffBottomWall = currentPoint.y < heightBound - 1 || (point.y === heightBound ? (
      (currentPoint.x === centerpointX) ||
      (currentPoint.x === centerpointX - 1 || currentPoint.x === centerpointX + 1) && point.x === centerpointX
    ) : (
        (point.y < heightBound - 1) ||
        point.x === centerpointX ||
        currentPoint.x === centerpointX
      ))

    const isPointNotOnExistingEdge = ((!compare || !compare.includes(getCoordKey(currentPoint))));

    return isPointBouncingOffSideWalls &&
      isPointNotOnExistingEdge &&
      isPointBouncingOffTopWall &&
      isPointBouncingOffBottomWall;
  });

  return legalMovePoints;
}


function drawMoveableSpots(edgeLength) {
  const radius = isMobile ? edgeLength / 3 : edgeLength / 8;
  const currentPoint = game.model.pointList[game.model.pointList.length - 1];
  const points = getLegalMoves(currentPoint);

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

      checkVictoryState(newPoint);
      checkTurnForState(newPoint);

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

  drawLinePath(game.model.pointList, edgeLength);
  drawCurrentSpot(currentPoint, edgeLength);

  if (game.model.winner === PLAYER_ONE || game.model.winner === PLAYER_TWO) {
    eraseMoveableSpots();
    drawInfo(INFO_PRIMARY, `Player ${game.model.winner + 1} wins the game!`);
    two.update();
  } else {
    drawMoveableSpots(edgeLength);
  }
  two.update();
}

function checkVictoryState(point) {
  // make sure this is legal

  // test for player 1 victory
  if (point.y <= 0) {
    game.model.winner = PLAYER_ONE;
    // test for player 2 victory
  } else if (point.y >= NUMBER_ROWS) {
    game.model.winner = PLAYER_TWO;
  }
}

function checkTurnForState(newPoint) {
  console.log(game.model.pointList);

  // @todo add edges/vertices for the pitch. Those don't currently bounce.

  // object equality....right...
  if (!game.model.pointList.some((p) => areCoordsEqual(newPoint, p))) {
    game.model.turnFor = Number(!Boolean(game.model.turnFor));
    drawActiveTurnPerson(false);
  } else {
    drawActiveTurnPerson(true);
  }
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
    (game.model.turnFor ? "Player 2" : "Player 1") +
    (isBouncing ? ", go again now!" : "");
  drawInfo(INFO_PRIMARY, statusText);
}
