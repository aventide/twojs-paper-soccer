// const defaultConfig = {fullscreen: true};
const NUMBER_ROWS = 10;
const NUMBER_COLS = 8;
const defaultConfig = {width: 700, height: 875};
const defaultEdgeLength = defaultConfig.width / NUMBER_COLS;

window.mobilecheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

const isMobile = window.mobilecheck();
if(isMobile){alert()}

function drawResponsivePitch() {
    if (window.innerWidth <= 700 || isMobile) {

        const edgeLength = window.innerWidth / NUMBER_COLS;

        two.width = window.innerWidth;
        two.height = window.innerHeight - (2 * edgeLength);
        drawPitch(edgeLength);
    } else {
        two.width = defaultConfig.width;
        two.height = defaultConfig.height;
        drawPitch(defaultEdgeLength);
    }
}

window.addEventListener('resize', function(){
    drawResponsivePitch();
});

// DOM stuff for Two.js
const appElem = document.getElementById('app');
const two = new Two(defaultConfig);
two.appendTo(appElem);

const initialHandles = {
    edges: [],
    legalMoveVertices: [],
    currentPositionDot: null,
    startPositionDot: null,
    graphPaper: null,
    pitchBounds: null
};

// model: effective state to base rendering from
// handles: references to two.js objects after creation, so they can be deleted or manipulated. May not include objects that never need manipulation.
const centerpoint = getCenterPoint(defaultEdgeLength);

game = {
    model: {
        pointList: [centerpoint],
        edgeMap: {[getCoordKey(centerpoint)]: []}
    },
    handles: {...initialHandles}
};

drawResponsivePitch();

function drawPitch(edgeLength) {

    two.clear();
    game.handles = {...initialHandles};

    const centerpoint = getCenterPoint(edgeLength);
    game.handles.graphPaper = drawGraphPaper(edgeLength);
    game.handles.pitchBounds = drawPitchBoundaries(edgeLength);
    game.handles.startPositionDot = drawStartDot(centerpoint, edgeLength);
    renderPath(edgeLength);
}


function drawGraphPaper(edgeLength) {

    const lines = [];

    for (let x = 0; x <= NUMBER_ROWS; x++) {
        const line = two.makeLine(0, x * edgeLength, (NUMBER_COLS * edgeLength), x * edgeLength);
        line.stroke = "lightblue";
        lines.push(lines);
    }
    for (let y = 0; y <= NUMBER_COLS; y++) {
        const line = two.makeLine(y * edgeLength, 0, y * edgeLength, (NUMBER_ROWS * edgeLength));
        line.stroke = "lightblue";
        lines.push(lines);
    }

    return lines;
}

function getCenterPoint() {
    return {
        x: NUMBER_COLS / 2,
        y: NUMBER_ROWS / 2
    };
}

function drawPitchBoundaries(edgeLength) {

    const segments = [];

    // get horizontal center
    const centerpointX = NUMBER_COLS * edgeLength / 2;

    // get half-height
    const heightBound = NUMBER_ROWS * edgeLength;
    const widthBound = NUMBER_COLS * edgeLength;

    // draw goal ends
    segments.push(
        // top end

        two.makeLine(centerpointX - edgeLength, 0, centerpointX + edgeLength, 0),

        two.makeLine(centerpointX - edgeLength, 0, centerpointX - edgeLength, edgeLength),
        two.makeLine(centerpointX + edgeLength, 0, centerpointX + edgeLength, edgeLength),

        two.makeLine(centerpointX - edgeLength, edgeLength, centerpointX - edgeLength * 4, edgeLength),
        two.makeLine(centerpointX + edgeLength, edgeLength, centerpointX + edgeLength * 4, edgeLength),

        // bottom end

        two.makeLine(centerpointX - edgeLength, heightBound, centerpointX + edgeLength, heightBound),
        two.makeLine(centerpointX - edgeLength, heightBound, centerpointX - edgeLength, heightBound - edgeLength),
        two.makeLine(centerpointX + edgeLength, heightBound, centerpointX + edgeLength, heightBound - edgeLength),

        two.makeLine(centerpointX - edgeLength, heightBound - edgeLength, centerpointX - edgeLength * 4, heightBound - edgeLength),
        two.makeLine(centerpointX + edgeLength, heightBound - edgeLength, centerpointX + edgeLength * 4, heightBound - edgeLength),

        // sides

        two.makeLine(0, edgeLength, 0, heightBound - edgeLength),
        two.makeLine(widthBound, edgeLength, widthBound, heightBound - edgeLength),
    );


    segments.forEach(s => s.linewidth = 3);
    return segments;

}

function drawStartDot(point, edgeLength) {

    const renderablePoint = {x: point.x * edgeLength, y: point.y * edgeLength};

    const dot = two.makeCircle(renderablePoint.x, renderablePoint.y, 8);
    dot.fill = "black";

    return dot;

}

function drawLinePath(points, edgeLength) {
    if (!points || !points.length) {
        return;
    }

    const renderablePoints = points.map(p => ({
        x: p.x * edgeLength,
        y: p.y * edgeLength
    }));

    let currentPoint;
    let nextPoint;

    for (let i in renderablePoints) {
        currentPoint = renderablePoints[Number(i)];
        nextPoint = renderablePoints[Number(i) + 1];
        if (nextPoint) {
            const segment = two.makeLine(currentPoint.x, currentPoint.y, nextPoint.x, nextPoint.y);
            segment.stroke = "black";
            segment.linewidth = 2;
        }
    }

    // const normalizedCurrentPoint = {x: currentPoint.x / edgeLength, y: currentPoint.y / edgeLength};
    // return normalizedCurrentPoint;

}

function drawMoveableSpots(fromCoord, edgeLength) {
    const points = [];
    const radius = isMobile ? (edgeLength / 3) : (edgeLength / 8);
    const heightBound = NUMBER_ROWS;
    const widthBound = NUMBER_COLS;
    const horizontalCenter = widthBound / 2;

    function makeCircleConditionally(x, y, radius) {

        // restrict movement off shoulders of the pitch
        if (y < 1 || y > (heightBound - 1)) {
            if (x < horizontalCenter - 1 || x > horizontalCenter + 1) {
                return null;
            }
        }

        const currentPoint = game.model.pointList[game.model.pointList.length - 1];
        const key = getCoordKey({x, y});
        const compare = game.model.edgeMap[key];
        if (!compare || !compare.includes(getCoordKey(currentPoint))) {
            return two.makeCircle(x * edgeLength, y * edgeLength, radius);
        }
    }

    points.push(
        makeCircleConditionally(fromCoord.x - 1, fromCoord.y, radius),
        makeCircleConditionally(fromCoord.x + 1, fromCoord.y, radius),
        makeCircleConditionally(fromCoord.x, fromCoord.y - 1, radius),
        makeCircleConditionally(fromCoord.x, fromCoord.y + 1, radius),
        makeCircleConditionally(fromCoord.x - 1, fromCoord.y - 1, radius),
        makeCircleConditionally(fromCoord.x - 1, fromCoord.y + 1, radius),
        makeCircleConditionally(fromCoord.x + 1, fromCoord.y + 1, radius),
        makeCircleConditionally(fromCoord.x + 1, fromCoord.y - 1, radius),
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

            const lastPoint = game.model.pointList[game.model.pointList.length - 1];
            const newPoint = {x: p._translation.x / edgeLength, y: p._translation.y / edgeLength};

            const lastPointKey = getCoordKey(lastPoint);
            const newPointKey = getCoordKey(newPoint);

            game.model.pointList.push(newPoint);
            if (game.model.edgeMap[newPointKey] && game.model.edgeMap[newPointKey].length) {
                game.model.edgeMap[newPointKey].push(lastPointKey);
                game.model.edgeMap[lastPointKey].push(newPointKey);
            } else {
                game.model.edgeMap[newPointKey] = [lastPointKey];
                game.model.edgeMap[lastPointKey].push(newPointKey);
            }

            renderPath(edgeLength);
        });
    });

    // remove old circles from the pitch
    two.remove(game.handles.legalMoveVertices);
    game.handles.legalMoveVertices = [...filteredPoints];
}

function getCoordKey(point) {
    return `${point.x}-${point.y}`;
}

function renderPath(edgeLength) {

    const currentPoint = game.model.pointList[game.model.pointList.length - 1];

    // const currentDot =
    drawLinePath(game.model.pointList, edgeLength);
    two.remove(game.handles.currentPositionDot);
    drawMoveableSpots(currentPoint, edgeLength);
    game.handles.currentPositionDot = two.makeCircle(currentPoint.x * edgeLength, currentPoint.y * edgeLength, edgeLength / 5);
    game.handles.currentPositionDot.fill = "yellow";
    two.update();
}