// define a box with opposing corners given by an anchor point and an ending point
// in the future, add functionality to limit any rendering outside of the limits of the box
function createBox(anchorPoint, endPoint){
    return {
        anchor: {
            x: anchorPoint.x,
            y: anchorPoint.y,
        }
    };
}