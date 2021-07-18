import {
  NUMBER_PITCH_ROWS,
  NUMBER_PITCH_COLS,
  CENTERPOINT,
  PLAYER_ONE,
} from "./constants";

import { getCoordKey } from "./util";
import { getLegalMoves, getVictoryState, getWhoseTurn, getShouldSwitchTurns } from './rules';

export function renderGame(game) {
  const { selectedLayer } = game;

  if (selectedLayer === 'start') {
    renderStartMenu(game);
  } else {
    game.two.clear();
    renderHeader(game);
    renderPitch(game);
    renderFooter(game)
  }
}

 function renderStartMenu(game) {

  const { two, edgeLength, views: { pitch: { anchor, end } } } = game;

  // get horizontal center
  const centerpointX = (end.x + anchor.x) / 2;

  // get vertical centerpoint
  const heightBound = (end.y + anchor.y) / 2;

  // 200 is the known height. We want to get to the proper scale value.
  // ScaleValue = edgeLength / known value
  game.handles.buttons.start.scale = edgeLength / 200;
  game.handles.buttons.start.translation.set(centerpointX, heightBound - (edgeLength * 0.5));
  game.handles.buttons.start.visible = true;
  game.handles.buttons.start._renderer.elem.addEventListener('click', () => {
    game.handles.buttons.start.visible = false;
    game.handles.buttons.rules.visible = false;
    game.selectedLayer = "game";
    renderGame(game);
  })

  game.handles.buttons.rules.scale = edgeLength / 200;
  game.handles.buttons.rules.translation.set(centerpointX, heightBound + edgeLength * 1.5);
  game.handles.buttons.rules.visible = true;
}

 function renderGraphPaper(game) {

  const { two, edgeLength, views: { pitch: { anchor, end } } } = game;
  const lines = [];

  for (let x = 0; x <= NUMBER_PITCH_ROWS; x++) {
    const line = two.makeLine(
      anchor.x,
      anchor.y + x * edgeLength,
      end.x,
      anchor.y + x * edgeLength
    );
    line.stroke = "#07bde5";
    line.opacity = 0.5;
    lines.push(lines);
  }
  for (let y = 0; y <= NUMBER_PITCH_COLS; y++) {
    const line = two.makeLine(
      anchor.x + y * edgeLength,
      anchor.y,
      anchor.x + y * edgeLength,
      end.y
    );
    line.stroke = "#07bde5";
    line.opacity = 0.5;
    lines.push(lines);
  }

  game.handles.graphPaper = two.makeGroup(lines);

}

 function renderPitchBorders(game) {
  const { two, edgeLength, views: { pitch: { anchor, end } } } = game;

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
  handles.forEach((s) => (s.cap = 'square'));

  game.handles.pitchBorders =  two.makeGroup(handles);

}

 function renderPitchGoals(game) {

  const { two, edgeLength, views: { pitch: { anchor, end } } } = game

  // get horizontal center
  const centerpointX = (end.x + anchor.x) / 2;

  // 200 is the known height. We want to get to the proper scale value.
  // ScaleValue = edgeLength / known value

  // goalshade purple
  game.handles.buttons.goalshade_purple.scale = edgeLength / 200;
  game.handles.buttons.goalshade_purple.translation.set(centerpointX, anchor.y + (edgeLength * 0.25));
  game.handles.buttons.goalshade_purple.visible = true;

  // goalshade orange
  game.handles.buttons.goalshade_orange.scale = edgeLength / 200;
  game.handles.buttons.goalshade_orange.translation.set(centerpointX, end.y - (edgeLength * 0.25));
  game.handles.buttons.goalshade_orange.visible = true;
}

 function renderStartDot(game) {

  const { two, edgeLength, views: { pitch: { anchor } } } = game;

  const renderablePoint = {
    x: anchor.x + CENTERPOINT.x * edgeLength,
    y: anchor.y + CENTERPOINT.y * edgeLength,
  };

  const dot = two.makeCircle(renderablePoint.x, renderablePoint.y, 8);
  dot.fill = "black";

  game.handles.startPositionDot = dot;
}

 function renderLinePath(game, points) {
  if (!points || !points.length) {
    return;
  }

  const { two, edgeLength, views: {
    pitch: { anchor }
  } } = game;

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

 function renderCurrentSpot(game, currentPoint) {
  const { two, edgeLength, views: { pitch: { anchor } } } = game;
  two.remove(game.handles.currentPositionDot);
  two.remove(game.handles.currentPositionRing);
  const centerDot = two.makeCircle(
    anchor.x + currentPoint.x * edgeLength,
    anchor.y + currentPoint.y * edgeLength,
    6
  );

  const turnForColor = game.model.turnFor === PLAYER_ONE ? 'rgba(102,51,153,1)' : 'rgba(238,118,0,1)';
  centerDot.fill = turnForColor;
  centerDot.stroke = turnForColor;

  const breathingCircle = two.makeCircle(
    anchor.x + currentPoint.x * edgeLength,
    anchor.y + currentPoint.y * edgeLength,
    edgeLength / 4
  )

  breathingCircle.stroke = turnForColor;
  breathingCircle.linewidth = 5;
  breathingCircle.noFill();

  game.handles.currentPositionDot = centerDot;
  game.handles.currentPositionRing = breathingCircle;
}

 function eraseMoveableSpots(game) {
  const { two } = game;
  two.remove(game.handles.moveableSpots);
}

 function renderPlayerGraphics(game) {
  const { two } = game
  const currentPoint = game.model.pointList[game.model.pointList.length - 1];
  renderLinePath(game, game.model.pointList);
  renderCurrentSpot(game, currentPoint);

  if (!!game.model.winner) {
    eraseMoveableSpots(game);
    //   drawInfo(INFO_PRIMARY, `Player ${game.model.winner} wins the game!`);
    two.update();
  } else {
    renderMoveableSpots(game);
  }
  two.update();
}

 function renderMoveableSpots(game) {
  const { two, edgeLength } = game;
  const radius = edgeLength / 8;
  const currentPoint = game.model.pointList[game.model.pointList.length - 1];
  const points = getLegalMoves(currentPoint, game.model.edgeMap);

  const renderedPoints = [];
  const { anchor } = game.views.pitch;
  points.forEach(point => {
    renderedPoints.push(two.makeCircle(
      anchor.x + point.x * edgeLength,
      anchor.y + point.y * edgeLength,
      radius
    ))
  });

  // need to update before assigning click handlers!
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
      const { anchor } = game.views.pitch;
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
      if(getShouldSwitchTurns(newPoint, game.model.pointList)){
        game.model.turnNumber += 1;
      }

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

      renderPlayerGraphics(game);
      renderHeader(game);
    });
  });

  // remove old circles from the pitch
  eraseMoveableSpots(game);
  game.handles.moveableSpots = [...renderedPoints];
}

// these renderers could be moved to specific folders.
// like, renderers/pitch

 function renderPitch(game) {
  renderGraphPaper(game);
  renderPitchBorders(game);
  renderStartDot(game);
  renderPitchGoals(game)
  renderPlayerGraphics(game);
}

 function renderHeader(game) {
  const {two, edgeLength, appWidth, views} = game
  const { header } = views;
  const { anchor, end } = header;

  const playerNameStyles = {
    family: 'roboto mono, sans-serif',
    size: 32,
    leading: 50,
    weight: 900,
  };

  const turnStyles = {
    family: 'roboto mono, sans-serif',
    size: 16,
    leading: 50,
    weight: 900,
  };

  // clean up old text
  if(game.handles.header){
    two.remove(game.handles.header);
  }

  const turnText = two.makeText("Turn:", anchor.x, 15, turnStyles);
  const movesText = two.makeText("Moves:", end.x - edgeLength, 15, turnStyles);
  const playerNameText = two.makeText("Alex", anchor.x, anchor.y + edgeLength, playerNameStyles);
  const numberOfMovesText = two.makeText(game.model.turnNumber, end.x - edgeLength , end.y - edgeLength, playerNameStyles);

  game.handles.header = two.makeGroup([
    turnText,
    movesText,
    playerNameText,
    numberOfMovesText
  ])

  game.two.update()
  turnText._renderer.elem.setAttribute('text-anchor', 'start');
  playerNameText._renderer.elem.setAttribute('text-anchor', 'start');
  movesText._renderer.elem.setAttribute('text-anchor', 'start');
  numberOfMovesText._renderer.elem.setAttribute('text-anchor', 'start');
}

 function renderFooter(game) {
  const {two, views, edgeLength, appWidth, appHeight} = game;
  const { footer } = views;
  const { anchor, end } = footer;

  const menuButtonStyles = {
    family: 'roboto mono, sans-serif',
    size: 16,
    leading: 50,
    weight: 900,
    fill: "#FFFFFF"
  }
  
  const centerpointX = (end.x + anchor.x) / 2;

  const button = two.makeRectangle(centerpointX, end.y - 0.5 * edgeLength, edgeLength * 6, edgeLength)
  button.fill = "#000000";
  
  const buttonText = two.makeText("MENU", centerpointX, end.y - 0.5 * edgeLength, menuButtonStyles)
  two.update()
}