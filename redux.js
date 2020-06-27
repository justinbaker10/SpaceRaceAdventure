const initialState = {
    score: 0,
    spaceShipPosition: 0,
    asteroidArray: [],
    
}
// Spaceship position range = 0 (bottom) - 550px

initialState.asteroidArray = [
    {
        size: 10,
        posY: 50,
        posX: 0,
        speed: .5,
    },
    {
        size: 70,
        posY: 150,
        posX: 0,
        speed: 2,
    },
    {
        size: 90,
        posY: 250,
        posX: 0,
        speed: 1,
    }
]

// if(newState.spaceShipPosition === newState.asteroidPosition) {
//     newState.spaceShipPosition = 0
// }

const store = Redux.createStore(reducer)
const topOfTheGameBoardpx = 550;
const widthOfTheGameboard = 550;
const maxAsteroidXValue = widthOfTheGameboard + 200;

function reducer (oldState, action) {
    if(oldState === undefined) oldState = initialState
    const newState = deepCopy(oldState)

    if(action.type === 'TICK') {
        newState.asteroidArray = newState.asteroidArray.reduce(function(newAsteroids, asteroid) {
            // Only keep this asteroid if is less than maxAsteroidXValue
            if(asteroid.posX < maxAsteroidXValue) {
                asteroid.posX = asteroid.posX + asteroid.speed
                newAsteroids.push(asteroid)
            }
            return newAsteroids
        },[])
    }

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