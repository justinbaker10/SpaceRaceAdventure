// Specifies initial game state
const initialState = {
    score: 0,
    spaceShipPosition: 0,
    asteroidArray: [createNewAsteroid()],

}

function createNewAsteroid () {
    return  {
        size: Math.floor(Math.random() * 100) + 10,
        posY: Math.floor(Math.random() * 500) + 50,
        posX: Math.floor(Math.random() * 500),
        speed: Math.random() * 2 + .3,
    }
}

function createAsteroidArray (score) {
    const asteroidArray = []
    for (i = 0; i < score; i++) {
        asteroidArray.push(createNewAsteroid())
    }
    return asteroidArray
}

function hasOverlap (box1, box2) {
    return box1.x1 < box2.x2 &&
           box1.x2 > box2.x1 &&
           box1.y1 < box2.y2 &&
           box1.y2 > box2.y1
}

function getSpaceshipBox (state) {
    return {
        x1: (widthOfTheGameboard / 2) - (widthOfSpaceship / 2),
        x2: (widthOfTheGameboard / 2) + (widthOfSpaceship / 2),
        y1: topOfTheGameBoardpx - state.spaceShipPosition,
        y2: topOfTheGameBoardpx - state.spaceShipPosition + heightOfSpaceship
    }
}


function getAsteroidBox (state, asteroidIndex) {
    const theAsteroid = state.asteroidArray[asteroidIndex]
    return {
        x1: theAsteroid.posX - theAsteroid.size,
        x2: theAsteroid.posX,
        y1: topOfTheGameBoardpx - theAsteroid.posY,
        y2: topOfTheGameBoardpx - theAsteroid.posY + theAsteroid.size
    }
}

// Sets up game variables
const store = Redux.createStore(reducer)
const topOfTheGameBoardpx = 550;
const widthOfTheGameboard = 550;
const widthOfSpaceship = 50;
const heightOfSpaceship = 50;
const maxAsteroidXValue = widthOfTheGameboard + 200;

// Updates game data (state)
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
            if(asteroid.posX > maxAsteroidXValue) {
                asteroid.posX = 0
            }
            return newAsteroids
        },[])
        newState.asteroidBox = getAsteroidBox(newState, 0)
        newState.shipBox = getSpaceshipBox(newState)
        if(hasOverlap(getSpaceshipBox(newState), getAsteroidBox(newState, 0))) {
            console.log(newState.asteroidBox)
            alert("I died...")
        }
    }

    if(action.type === 'MOVE_UP') {
        newState.spaceShipPosition = newState.spaceShipPosition + 15
        if(newState.spaceShipPosition > topOfTheGameBoardpx) {
            newState.spaceShipPosition = 0
            newState.score = newState.score + 1
            newState.asteroidArray = createAsteroidArray(newState.score)
        }
    }

    else if(action.type === 'MOVE_DOWN') {
        newState.spaceShipPosition = newState.spaceShipPosition - 15
        if(newState.spaceShipPosition < 0) {
            newState.spaceShipPosition = 0
        }
    }

    return newState
}

function deepCopy (obj1) {
    return JSON.parse(JSON.stringify(obj1))
}
