import { NUMBER_COLS, NUMBER_ROWS } from "./constants";

function getCenterPoint() {
  return {
    x: NUMBER_COLS / 2,
    y: NUMBER_ROWS / 2,
  };
}

function getCoordKey(point) {
  return `${point.x}-${point.y}`;
}

export { getCenterPoint, getCoordKey };
