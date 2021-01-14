import {
    NUMBER_ROWS,
    NUMBER_COLS
} from './constants'

import {
    getCoordKey
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
  
      const heightBound = NUMBER_ROWS;
      const widthBound = NUMBER_COLS;
      const centerpointX = widthBound / 2;
      const key = getCoordKey({ x: point.x, y: point.y });
      const compare = edgeMap[key];
  
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