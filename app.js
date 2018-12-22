// const config = {fullscreen: true};
const config = {width: 450, height: 500};

const appElem = document.getElementById('app');
const two = new Two(config);

two.appendTo(appElem);

function drawGraphPaper(nRows, nCols, increment) {
    for (let x = 0; x <= nRows; x++) {
        const line = two.makeLine(0, x * increment, (nCols * increment), x * increment);
        line.stroke = "lightblue";
    }
    for (let y = 0; y <= nCols; y++) {
        const line = two.makeLine(y * increment, 0, y * increment, (nRows * increment));
        line.stroke = "lightblue";
    }
}

function getCenterPoint(nRows, nCols, increment) {
    const centerpointX = nCols * increment / 2;
    const centerpointY = nRows * increment / 2;
    return {
        x: centerpointX,
        y: centerpointY
    };
}

function drawPitch(nRows, nCols, increment) {

    const segments = [];

    // get center
    const centerpointX = nCols * increment / 2;
    const centerpointY = nRows * increment / 2;

    // get half-height
    const heightBound = nRows * increment;
    const widthBound = nCols * increment;

    // draw goal ends
    segments.push(
        // top end

        two.makeLine(centerpointX - increment, 0, centerpointX + increment, 0),

        two.makeLine(centerpointX - increment, 0, centerpointX - increment, increment),
        two.makeLine(centerpointX + increment, 0, centerpointX + increment, increment),

        two.makeLine(centerpointX - increment, increment, centerpointX - increment * 4, increment),
        two.makeLine(centerpointX + increment, increment, centerpointX + increment * 4, increment),

        // bottom end

        two.makeLine(centerpointX - increment, heightBound, centerpointX + increment, heightBound),
        two.makeLine(centerpointX - increment, heightBound, centerpointX - increment, heightBound - increment),
        two.makeLine(centerpointX + increment, heightBound, centerpointX + increment, heightBound - increment),

        two.makeLine(centerpointX - increment, heightBound - increment, centerpointX - increment * 4, heightBound - increment),
        two.makeLine(centerpointX + increment, heightBound - increment, centerpointX + increment * 4, heightBound - increment),

        // sides

        two.makeLine(0, increment, 0, heightBound - increment),
        two.makeLine(widthBound, increment, widthBound, heightBound - increment),
    );


    segments.forEach(s => s.linewidth = 3);

}

function drawStartDot(point) {
    const dot = two.makeCircle(point.x, point.y, 8);
    dot.fill = "black";

    return dot;

}

function drawLinePath(points) {
    if (!points || !points.length) {
        return;
    }
    let currentPoint;
    let nextPoint;

    for (let i in points) {
        currentPoint = points[Number(i)];
        nextPoint = points[Number(i) + 1];
        if (nextPoint) {
            const segment = two.makeLine(currentPoint.x, currentPoint.y, nextPoint.x, nextPoint.y);
            segment.stroke = "black";
            segment.linewidth = 2;
        }
    }

    return currentPoint;

}

function drawMoveableSpots(fromCoord, increment) {
    const points = [];
    const MOVEABLE_CIRCLE_RADIUS = 8;

    points.push(
        two.makeCircle(fromCoord.x - increment, fromCoord.y, MOVEABLE_CIRCLE_RADIUS),
        two.makeCircle(fromCoord.x + increment, fromCoord.y, MOVEABLE_CIRCLE_RADIUS),
        two.makeCircle(fromCoord.x, fromCoord.y - increment, MOVEABLE_CIRCLE_RADIUS),
        two.makeCircle(fromCoord.x, fromCoord.y + increment, MOVEABLE_CIRCLE_RADIUS),
        two.makeCircle(fromCoord.x - increment, fromCoord.y - increment, MOVEABLE_CIRCLE_RADIUS),
        two.makeCircle(fromCoord.x - increment, fromCoord.y + increment, MOVEABLE_CIRCLE_RADIUS),
        two.makeCircle(fromCoord.x + increment, fromCoord.y + increment, MOVEABLE_CIRCLE_RADIUS),
        two.makeCircle(fromCoord.x + increment, fromCoord.y - increment, MOVEABLE_CIRCLE_RADIUS),
    );

    two.update();

    points.forEach(p => {
        p._renderer.elem.addEventListener('mouseover', function () {
            p.fill = "lightblue";
            p.opacity = 0.6;
            two.update();
        });
        p._renderer.elem.addEventListener('mouseout', function () {
            p.fill = "white";
            p.opacity = 1;
            two.update();
        });
        p._renderer.elem.addEventListener('click', function () {
            // alert(p._translation.x + " " + p._translation.y);
            pathPoints.push({x: p._translation.x, y: p._translation.y});
            renderPath();
        });
    });
    moveablePoints = [...points];
}

function renderPath(){
    const currentDot = drawLinePath(pathPoints, 50);
    two.remove(moveablePoints);
    two.remove(dotMarker);
    moveablePoints = [];
    drawMoveableSpots(currentDot, 50);
    dotMarker = two.makeCircle(currentDot.x, currentDot.y, 12);
    dotMarker.fill = "yellow";
    two.update();
}

const centerpoint = getCenterPoint(10, 8, 50);
const pathPoints = [centerpoint];

let moveablePoints = [];
let dotMarker = null;
drawMoveableSpots(centerpoint, 50);

const pointMap = {};

drawGraphPaper(10, 8, 50);
drawPitch(10, 8, 50);
drawStartDot(centerpoint);

renderPath();
