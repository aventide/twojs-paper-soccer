import {  INITIAL_GAME_MODEL, DEFAULT_PITCH_DIMENSIONS } from './constants'

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

export function loadCore() {
    
    // DOM stuff for Two.js
    const appElem = document.getElementById("app");
    const two = new Two(DEFAULT_PITCH_DIMENSIONS);
    two.appendTo(appElem);
    
    // boxes: subdvisions of the main canvas specific for this game. Used for placement of main elements
    // model: effective state to base rendering from
    // handles: references to two.js objects after creation, so they can be deleted or manipulated. May not include objects that never need manipulation.
    
    // game state: whose turn it is, whether turn is complete (any possible moves left), path in current turn (if enabled), whether game is won and who won
    return {
      ...INITIAL_GAME_MODEL,
      two
    };    
  }
  