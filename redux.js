const initialState = {
    score: 0,
    spaceShipPosition: 0,
    
}
// Spaceship position range = 0 (bottom) - 550px

const store = Redux.createStore(reducer)
const topOfTheGameBoardpx = 550;
function reducer (oldState, action) {
    if(oldState === undefined) oldState = initialState
    const newState = deepCopy(oldState)

    if(action.type === 'MOVE_UP') {
        newState.spaceShipPosition = newState.spaceShipPosition + 10
        if(newState.spaceShipPosition > topOfTheGameBoardpx) {
            newState.spaceShipPosition = 0
            newState.score = newState.score + 1
        }
    }

    else if(action.type === 'MOVE_DOWN') {
        newState.spaceShipPosition = newState.spaceShipPosition - 10
        if(newState.spaceShipPosition < 0) {
            newState.spaceShipPosition = 0
        }
    }
    
    return newState
}

function deepCopy (obj1) {
    return JSON.parse(JSON.stringify(obj1))
}