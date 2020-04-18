function getCoordKey(point) {
  return `${point.x}-${point.y}`;
}

function areCoordsEqual(point1, point2) {
  return getCoordKey(point1) === getCoordKey(point2);
}

export { getCoordKey, areCoordsEqual };
