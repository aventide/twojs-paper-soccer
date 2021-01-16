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