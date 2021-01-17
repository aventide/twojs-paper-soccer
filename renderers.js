/* renderer - a function that draws graphics to the two.js canvas based on existing game state.

renderers are routines, meaning that they function by having side effects. They could have a return value that is a status, if need be.

renderers need to know the following values to work:

1. anchorpoint, to know where to draw
2. edgeLength, to handle responsiveness
3. access to game state, to know what objects to draw and where

So renderer functions in this game can assume they recieve these params:

anchor: {x, y}
edgeLength: x
state: {
    ...state generating functions, aka rules.
}

rules are functions that return game state based on conditions present on the game object, or conditions present in a temporary object
these rule functions will come in handy when it's time to do server-side validation of game moves

*/

import {
    NUMBER_ROWS,
    NUMBER_COLS,
    CENTERPOINT
  } from "./constants";

export function renderGraphPaper(two, box, edgeLength) {
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

export function renderPitchBorders(two, box, edgeLength) {
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

export function renderStartDot(two, box, edgeLength) {

    const { anchor } = box;
    const renderablePoint = {
        x: anchor.x + CENTERPOINT.x * edgeLength,
        y: anchor.y + CENTERPOINT.y * edgeLength,
    };

    const dot = two.makeCircle(renderablePoint.x, renderablePoint.y, 8);
    dot.fill = "black";

    return dot;
}

export function renderLinePath(two, box, edgeLength, points) {
    if (!points || !points.length) {
      return;
    }
  
    const { anchor } = box;
  
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