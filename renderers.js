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

import { getCoordKey } from "./util";
import { getLegalMoves, getVictoryState, getWhoseTurn } from './rules';

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

export function renderCurrentSpot(game, currentPoint, edgeLength) {
    const { two } = game;
    const { anchor } = game.boxes.pitch;
    two.remove(game.handles.currentPositionDot);
    game.handles.currentPositionDot = two.makeCircle(
      anchor.x + currentPoint.x * edgeLength,
      anchor.y + currentPoint.y * edgeLength,
      edgeLength / 5
    );
    game.handles.currentPositionDot.fill = "yellow";
  }

export function eraseMoveableSpots(game) {
    const { two } = game;
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
        // drawActiveTurnPerson(game.model.isBouncing);
  
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
  
        renderPlayerGraphics(game, edgeLength);
      });
    });
  
    // remove old circles from the pitch
    eraseMoveableSpots(game);
    game.handles.moveableSpots = [...renderedPoints];
  }
  

export function renderPlayerGraphics(game, edgeLength) {
    const {two} = game
    const currentPoint = game.model.pointList[game.model.pointList.length - 1];
    renderLinePath(game.two, game.boxes.pitch, edgeLength,  game.model.pointList);
    renderCurrentSpot(game, currentPoint, edgeLength);
  
    if (!!game.model.winner) {
      eraseMoveableSpots(game);
    //   drawInfo(INFO_PRIMARY, `Player ${game.model.winner} wins the game!`);
      two.update();
    } else {
      renderMoveableSpots(game, edgeLength);
    }
    two.update();
  }

  
  function renderMoveableSpots(game, edgeLength) {
      const { two} = game;
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
        // drawActiveTurnPerson(game.model.isBouncing);
  
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
  
        renderPlayerGraphics(game, edgeLength);
      });
    });
  
    // remove old circles from the pitch
    eraseMoveableSpots(game);
    game.handles.moveableSpots = [...renderedPoints];
  }
  