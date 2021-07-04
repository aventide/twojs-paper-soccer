import {
  NUMBER_PITCH_ROWS,
  NUMBER_PITCH_COLS,
  PLAYER_ONE,
  PLAYER_TWO,
  PITCH_EDGE_POINTS
} from './constants'

import {
  getCoordKey,
  areCoordsEqual
} from './util'

export function getLegalMoves(currentPoint, edgeMap) {

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

    const heightBound = NUMBER_PITCH_ROWS;
    const widthBound = NUMBER_PITCH_COLS;
    const centerpointX = widthBound / 2;
    const key = getCoordKey({ x: point.x, y: point.y });
    const compare = edgeMap[key];

    const isPointLegallyBouncingOffSideWalls = (currentPoint.x > 0 || point.x > 0) && (currentPoint.x < widthBound || point.x < widthBound)

    // immediately resolves as true if not bouncing off top wall
    const isPointLegallyBouncingOffTopWall = currentPoint.y > 1 || (point.y === 0 ? (
      (currentPoint.x === centerpointX) ||
      (currentPoint.x === centerpointX - 1 || currentPoint.x === centerpointX + 1) && point.x === centerpointX
    ) : (
      (point.y > 1) ||
      point.x === centerpointX ||
      currentPoint.x === centerpointX
    ))

    // immediately resolves as true if not bouncing off bottom wall
    const isPointLegallyBouncingOffBottomWall = currentPoint.y < heightBound - 1 || (point.y === heightBound ? (
      (currentPoint.x === centerpointX) ||
      (currentPoint.x === centerpointX - 1 || currentPoint.x === centerpointX + 1) && point.x === centerpointX
    ) : (
      (point.y < heightBound - 1) ||
      point.x === centerpointX ||
      currentPoint.x === centerpointX
    ))

    const isPointNotOnExistingEdge = ((!compare || !compare.includes(getCoordKey(currentPoint))));

    // @todo some of these rules are badly named or at least looooong. 
    return isPointLegallyBouncingOffSideWalls &&
      isPointNotOnExistingEdge &&
      isPointLegallyBouncingOffTopWall &&
      isPointLegallyBouncingOffBottomWall;
  });

  return legalMovePoints;
}

export function getVictoryState(point) {
  if (point.y <= 0) {
    return PLAYER_ONE;
  } else if (point.y >= NUMBER_PITCH_ROWS) {
    return PLAYER_TWO;
  } else {
    return null;
  }
}

export function getShouldSwitchTurns(nextPoint, playedPoints) {
  // change turn if no vertex bouncing occurred
  return !playedPoints.some((p) => areCoordsEqual(nextPoint, p)) && !PITCH_EDGE_POINTS.some((p) => areCoordsEqual(nextPoint, p))
}

export function getWhoseTurn(nextPoint, currentPlayer, playedPoints) {
  let whoseTurn = currentPlayer;

  const shouldSwitchTurns = getShouldSwitchTurns(nextPoint, playedPoints)

  if (shouldSwitchTurns) {
    whoseTurn = currentPlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE
  }

  return whoseTurn;
}