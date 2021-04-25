// Row/Col numbers and padding must have the same ratios!
const NUMBER_ROWS = 10;
const NUMBER_COLS = 8;
const DEFAULT_PADDING_Y = 20;
const DEFAULT_PADDING_X = 16;

const CENTERPOINT_X = NUMBER_COLS / 2;
const CENTERPOINT_Y = NUMBER_ROWS / 2;
const CENTERPOINT = {
  x: NUMBER_COLS / 2,
  y: NUMBER_ROWS / 2,
};

// bouncable points along edge of pitch
const PITCH_EDGE_POINTS = [];
// left and right side walls
for(let y = 1; y <= NUMBER_ROWS - 1; y++){
  PITCH_EDGE_POINTS.push({x: 0, y})
  PITCH_EDGE_POINTS.push({x: NUMBER_COLS, y})
}
// top and bottom walls excluding goal openings
for(let x = 0; x <= NUMBER_COLS; x++){
  if(x <= CENTERPOINT_X - 1 || x >= CENTERPOINT_X + 1 ){
    PITCH_EDGE_POINTS.push({x, y: 1})
    PITCH_EDGE_POINTS.push({x, y: NUMBER_ROWS - 1})
  }
}

// @todo this is a bit big on desktop
// const DEFAULT_PITCH_DIMENSIONS = { width: 700, height: 875 };
const DEFAULT_PITCH_DIMENSIONS = { width: 440, height: 550 };

const INFO_PRIMARY = "info-primary";

const INITIAL_HANDLES = {
  edges: [],
  moveableSpots: [],
  currentPositionDot: null,
  startPositionDot: null,
  graphPaper: null,
  pitchBorders: null,
};

const PLAYER_ONE = 1;
const PLAYER_TWO = 2;

// edgeMap is the list of edges that already exist, and cannot be drawn on.
const INITIAL_EDGE_MAP = { [`${CENTERPOINT.x}-${CENTERPOINT.y}`]: [] }

const INITIAL_GAME_MODEL = {
  views: {
    pitch: {
      anchor: {
        x: 0,
        y: 0,
      },
      end: {
        x: 0,
        y: 0,
      },
    },
  },
  model: {
    pointList: [CENTERPOINT],
    edgeMap: INITIAL_EDGE_MAP,
    winner: null,
    turnFor: PLAYER_ONE,
    isBouncing: false,
  },
  handles: { ...INITIAL_HANDLES },
  // if the game was turned into a class, then we could access two, edgeLength, etc, without the extra args
  renderers: {
    init: null
  },
  selectedLayer: 'start',
  edgeLength: 0,

};

export {
  NUMBER_ROWS,
  NUMBER_COLS,
  CENTERPOINT,
  CENTERPOINT_X,
  CENTERPOINT_Y,
  PITCH_EDGE_POINTS,
  DEFAULT_PADDING_X,
  DEFAULT_PADDING_Y,
  DEFAULT_PITCH_DIMENSIONS,
  INITIAL_GAME_MODEL,
  PLAYER_ONE,
  PLAYER_TWO,
  INFO_PRIMARY
};
