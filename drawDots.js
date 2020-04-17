import { getCenterPoint, getCoordKey } from "./util";
import { NUMBER_COLS, NUMBER_ROWS } from "./constants";
import mobilecheck from "./util/mobilecheck";

function drawStartDot(game, box, edgeLength) {
  const point = getCenterPoint(edgeLength);
  const two = game.twoInstance;
  const { anchor } = box;

  const renderablePoint = {
    x: anchor.x + point.x * edgeLength,
    y: anchor.y + point.y * edgeLength,
  };

  const dot = two.makeCircle(renderablePoint.x, renderablePoint.y, 8);
  dot.fill = "black";

  return dot;
}

function drawCurrentSpot(game, edgeLength) {
  const currentPoint = game.model.pointList[game.model.pointList.length - 1];
  const { anchor } = game.boxes.pitch;
  const two = game.twoInstance;

  game.handles.currentPositionDot = two.makeCircle(
    anchor.x + currentPoint.x * edgeLength,
    anchor.y + currentPoint.y * edgeLength,
    edgeLength / 5
  );
  two.remove(game.handles.currentPositionDot);
  game.handles.currentPositionDot.fill = "yellow";
}

function drawMoveableSpots(game, fromCoord, edgeLength, inputHandler) {
  const points = [];
  const isMobile = mobilecheck();
  const two = game.twoInstance;

  const radius = isMobile ? edgeLength / 3 : edgeLength / 8;
  const heightBound = NUMBER_ROWS;
  const widthBound = NUMBER_COLS;
  const horizontalCenter = widthBound / 2;

  function makeCircleConditionally(x, y, radius) {
    // restrict movement off shoulders of the pitch
    if (y < 1 || y > heightBound - 1) {
      if (x < horizontalCenter - 1 || x > horizontalCenter + 1) {
        return null;
      }
    }

    const currentPoint = game.model.pointList[game.model.pointList.length - 1];
    const { anchor } = game.boxes.pitch;

    const key = getCoordKey({ x, y });
    const compare = game.model.edgeMap[key];
    if (!compare || !compare.includes(getCoordKey(currentPoint))) {
      return two.makeCircle(
        anchor.x + x * edgeLength,
        anchor.y + y * edgeLength,
        radius
      );
    }
  }

  points.push(
    makeCircleConditionally(fromCoord.x - 1, fromCoord.y, radius),
    makeCircleConditionally(fromCoord.x + 1, fromCoord.y, radius),
    makeCircleConditionally(fromCoord.x, fromCoord.y - 1, radius),
    makeCircleConditionally(fromCoord.x, fromCoord.y + 1, radius),
    makeCircleConditionally(fromCoord.x - 1, fromCoord.y - 1, radius),
    makeCircleConditionally(fromCoord.x - 1, fromCoord.y + 1, radius),
    makeCircleConditionally(fromCoord.x + 1, fromCoord.y + 1, radius),
    makeCircleConditionally(fromCoord.x + 1, fromCoord.y - 1, radius)
  );

  const filteredPoints = points.filter((p) => p);

  two.update();

  filteredPoints.forEach((p) => inputHandler(game, p));

  // remove old circles from the pitch
  two.remove(game.handles.legalMoveVertices);
  game.handles.legalMoveVertices = [...filteredPoints];
}

export { drawStartDot, drawMoveableSpots, drawCurrentSpot };
