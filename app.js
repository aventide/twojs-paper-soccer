// const config = {fullscreen: true};
const config = {width: 400, height: 500};
let NUMBER_ROWS = 10;
let NUMBER_COLS = 8;
let EDGE_LENGTH = 50;

// window.addEventListener('resize', function(){
//     if(window.innerWidth <= 800){
//         two.width = window.innerWidth;
//         EDGE_LENGTH = window.innerWidth / 8;
//         two.height = window.innerHeight - (EDGE_LENGTH * 2);
//         // setup();
//     }
// });

const appElem = document.getElementById('app');
const two = new Two(config);

two.appendTo(appElem);

// edgeMap: a hashmap to track which edges exist, or which points connect to which others already
// handles: references to two.js objects after creation, so they can be deleted or manipulated. May not include objects that never need manipulation.
gameState = {
    edgeMap: {},
    handles: {
        legalMoveVertices: []
    }
};

const centerpoint = getCenterPoint();
const pathPoints = [centerpoint];
const pathEdgeMap = {[getCoordKey(centerpoint)]: []};
let moveablePoints = [];
let dotMarker = null;
setup();

function setup(){

    const centerpoint = getCenterPoint();
    drawGraphPaper();
    drawPitch();
    drawStartDot(centerpoint);
    renderPath();
}


function drawGraphPaper() {
    for (let x = 0; x <= NUMBER_ROWS; x++) {
        const line = two.makeLine(0, x * EDGE_LENGTH, (NUMBER_COLS * EDGE_LENGTH), x * EDGE_LENGTH);
        line.stroke = "lightblue";
    }
    for (let y = 0; y <= NUMBER_COLS; y++) {
        const line = two.makeLine(y * EDGE_LENGTH, 0, y * EDGE_LENGTH, (NUMBER_ROWS * EDGE_LENGTH));
        line.stroke = "lightblue";
    }
}

function getCenterPoint() {
    const centerpointX = NUMBER_COLS * EDGE_LENGTH / 2;
    const centerpointY = NUMBER_ROWS * EDGE_LENGTH / 2;
    return {
        x: centerpointX,
        y: centerpointY
    };
}

function drawPitch() {

    const segments = [];

    // get horizontal center
    const centerpointX = NUMBER_COLS * EDGE_LENGTH / 2;

    // get half-height
    const heightBound = NUMBER_ROWS * EDGE_LENGTH;
    const widthBound = NUMBER_COLS * EDGE_LENGTH;

    // draw goal ends
    segments.push(
        // top end

        two.makeLine(centerpointX - EDGE_LENGTH, 0, centerpointX + EDGE_LENGTH, 0),

        two.makeLine(centerpointX - EDGE_LENGTH, 0, centerpointX - EDGE_LENGTH, EDGE_LENGTH),
        two.makeLine(centerpointX + EDGE_LENGTH, 0, centerpointX + EDGE_LENGTH, EDGE_LENGTH),

        two.makeLine(centerpointX - EDGE_LENGTH, EDGE_LENGTH, centerpointX - EDGE_LENGTH * 4, EDGE_LENGTH),
        two.makeLine(centerpointX + EDGE_LENGTH, EDGE_LENGTH, centerpointX + EDGE_LENGTH * 4, EDGE_LENGTH),

        // bottom end

        two.makeLine(centerpointX - EDGE_LENGTH, heightBound, centerpointX + EDGE_LENGTH, heightBound),
        two.makeLine(centerpointX - EDGE_LENGTH, heightBound, centerpointX - EDGE_LENGTH, heightBound - EDGE_LENGTH),
        two.makeLine(centerpointX + EDGE_LENGTH, heightBound, centerpointX + EDGE_LENGTH, heightBound - EDGE_LENGTH),

        two.makeLine(centerpointX - EDGE_LENGTH, heightBound - EDGE_LENGTH, centerpointX - EDGE_LENGTH * 4, heightBound - EDGE_LENGTH),
        two.makeLine(centerpointX + EDGE_LENGTH, heightBound - EDGE_LENGTH, centerpointX + EDGE_LENGTH * 4, heightBound - EDGE_LENGTH),

        // sides

        two.makeLine(0, EDGE_LENGTH, 0, heightBound - EDGE_LENGTH),
        two.makeLine(widthBound, EDGE_LENGTH, widthBound, heightBound - EDGE_LENGTH),
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

function drawMoveableSpots(fromCoord) {
    const points = [];
    const MOVEABLE_CIRCLE_RADIUS = 8;

    function makeCircleConditionally(x, y, radius) {

        const currentPoint = pathPoints[pathPoints.length - 1];
        const key = getCoordKey({x, y});
        const compare = pathEdgeMap[key];
        if (!compare || !compare.includes(getCoordKey(currentPoint))) {
            return two.makeCircle(x, y, radius);
        }
    }

    points.push(
        makeCircleConditionally(fromCoord.x - EDGE_LENGTH, fromCoord.y, MOVEABLE_CIRCLE_RADIUS),
        makeCircleConditionally(fromCoord.x + EDGE_LENGTH, fromCoord.y, MOVEABLE_CIRCLE_RADIUS),
        makeCircleConditionally(fromCoord.x, fromCoord.y - EDGE_LENGTH, MOVEABLE_CIRCLE_RADIUS),
        makeCircleConditionally(fromCoord.x, fromCoord.y + EDGE_LENGTH, MOVEABLE_CIRCLE_RADIUS),
        makeCircleConditionally(fromCoord.x - EDGE_LENGTH, fromCoord.y - EDGE_LENGTH, MOVEABLE_CIRCLE_RADIUS),
        makeCircleConditionally(fromCoord.x - EDGE_LENGTH, fromCoord.y + EDGE_LENGTH, MOVEABLE_CIRCLE_RADIUS),
        makeCircleConditionally(fromCoord.x + EDGE_LENGTH, fromCoord.y + EDGE_LENGTH, MOVEABLE_CIRCLE_RADIUS),
        makeCircleConditionally(fromCoord.x + EDGE_LENGTH, fromCoord.y - EDGE_LENGTH, MOVEABLE_CIRCLE_RADIUS),
    );

    const filteredPoints = points.filter(p => p);

    two.update();

    filteredPoints.forEach(p => {
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

            const lastPoint = pathPoints[pathPoints.length - 1];
            const newPoint = {x: p._translation.x, y: p._translation.y};

            const lastPointKey = getCoordKey(lastPoint);
            const newPointKey = getCoordKey(newPoint);

            pathPoints.push(newPoint);
            if (pathEdgeMap[newPointKey] && pathEdgeMap[newPointKey].length) {
                pathEdgeMap[newPointKey].push(lastPointKey);
                pathEdgeMap[lastPointKey].push(newPointKey);
            } else {
                pathEdgeMap[newPointKey] = [lastPointKey];
                pathEdgeMap[lastPointKey].push(newPointKey);
            }

            renderPath();
        });
    });

    // remove old circles from the pitch
    two.remove(moveablePoints);
    moveablePoints = [...filteredPoints];
}

function getCoordKey(point) {
    return `${point.x}${point.y}`;
}

// ah jeez, we need a handle to the array of lines...
// function backTrack(){
//     two.remove()
// }

function renderPath() {
    const currentDot = drawLinePath(pathPoints, 50);
    two.remove(dotMarker);
    drawMoveableSpots(currentDot, 50);
    dotMarker = two.makeCircle(currentDot.x, currentDot.y, 12);
    dotMarker.fill = "yellow";
    two.update();
}