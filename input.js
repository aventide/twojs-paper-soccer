import { NUMBER_COLS } from "./constants";
import { getCoordKey } from "./util";

function assignInputHandlers(game, p) {
  const two = game.twoInstance;
  const { pitch } = game.boxes;

  // @todo consolidate edgelength?
  const edgeLength = (pitch.end.x - pitch.anchor.x) / NUMBER_COLS;

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
  p._renderer.elem.addEventListener("click", function () {
    const { anchor } = game.boxes.pitch;
    const lastPoint = game.model.pointList[game.model.pointList.length - 1];

    const newPoint = {
      x: (p._translation.x - anchor.x) / edgeLength,
      y: (p.translation.y - anchor.y) / edgeLength,
    };

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
  });
}

export { assignInputHandlers };
