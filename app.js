

// const config = {fullscreen: true};
const config = {width: 450, height: 500};

const appElem = document.getElementById('app');
const two = new Two(config);

two.appendTo(appElem);

let pos = {x: 100, y: 100};

function drawGraphPaper (nRows, nCols, increment){
    for(let x = 0; x <= nRows; x++) {
        const line = two.makeLine(0, x * increment, (nCols * increment), x * increment);
        line.stroke = "lightblue";
    }
    for(let y = 0; y <= nCols; y++) {
        const line = two.makeLine(y * increment, 0, y * increment, (nRows * increment));
        line.stroke = "lightblue";
    }
}

function drawGoalA (nRows, nCols, increment){
    const centerpointX = nCols * increment / 2;

    const back = two.makeLine(centerpointX - increment, 0, centerpointX + increment, 0);
    back.stroke = "black";

    const side1 = two.makeLine(centerpointX - increment, 0, centerpointX - increment, increment);
    const side2 = two.makeLine(centerpointX + increment, 0, centerpointX + increment, increment);
    side1.stroke = "black";
    side2.stroke = "black";

}

function drawPitch (nRows, nCols, increment) {

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

function drawStartDot (nRows, nCols, increment) {
    const centerpointX = nCols * increment / 2;
    const centerpointY = nRows * increment / 2;
    const dot = two.makeCircle(centerpointX, centerpointY, 8);
    dot.fill = "black";
}

function drawLineSegment (nRows, nCols, increment) {
    const centerpointX = nCols * increment / 2;
    const centerpointY = nRows * increment / 2;
    const segment = two.makeLine(centerpointX, centerpointY, centerpointX + increment, centerpointY + increment);
    segment.stroke = "black";
    segment.linewidth = 2;

    const segment2 = two.makeLine(centerpointX + increment,  centerpointY + increment, centerpointX, centerpointY + increment * 2 );
    segment2.stroke = "black";
    segment2.linewidth = 2;

    const dotMarker = two.makeCircle(centerpointX, centerpointY + increment * 2, 12);
    dotMarker.fill = "yellow";

}

drawGraphPaper(10, 8, 50);
drawStartDot(10, 8, 50);
drawPitch(10, 8, 50);
drawLineSegment(10, 8, 50);
two.update();