// Specifies initial game state
const initialState = {
    score: 0,
    spaceShipPosition: 0,
    asteroidArray: [],
    
}

// Array of asteroid data
// Minimum Asteroid posY must be >= 60
initialState.asteroidArray = [
    {
        size: Math.floor(Math.random() * 100) + 10,
        posY: Math.floor(Math.random() * 500) + 50,
        posX: 0,
        speed: Math.random() * 2 + .3,
    },
    {
        size: Math.floor(Math.random() * 100) + 10,
        posY: Math.floor(Math.random() * 500) + 50,
        posX: 0,
        speed: Math.random() * 2 + .3,
    },
    {
        size: Math.floor(Math.random() * 100) + 10,
        posY: Math.floor(Math.random() * 500) + 50,
        posX: 0,
        speed: Math.random() * 2 + .3,
    },
    {
        size: Math.floor(Math.random() * 100) + 10,
        posY: Math.floor(Math.random() * 500) + 50,
        posX: 0,
        speed: Math.random() * 2 + .3,
    },
    {
        size: Math.floor(Math.random() * 100) + 10,
        posY: Math.floor(Math.random() * 500) + 50,
        posX: 0,
        speed: Math.random() * 2 + .3,
    },
    {
        size: Math.floor(Math.random() * 100) + 10,
        posY: Math.floor(Math.random() * 500) + 50,
        posX: 0,
        speed: Math.random() * 2 + .3,
    },
    {
        size: Math.floor(Math.random() * 100) + 10,
        posY: Math.floor(Math.random() * 500) + 50,
        posX: 0,
        speed: Math.random() * 2 + .3,
    },
    {
        size: Math.floor(Math.random() * 100) + 10,
        posY: Math.floor(Math.random() * 500) + 50,
        posX: 0,
        speed: Math.random() * 2 + .3,
    },
    {
        size: Math.floor(Math.random() * 100) + 10,
        posY: Math.floor(Math.random() * 500) + 50,
        posX: 0,
        speed: Math.random() * 2 + .3,
    },
    {
        size: Math.floor(Math.random() * 100) + 10,
        posY: Math.floor(Math.random() * 500) + 50,
        posX: 0,
        speed: Math.random() * 2 + .3,
    },
    {
        size: Math.floor(Math.random() * 100) + 10,
        posY: Math.floor(Math.random() * 500) + 50,
        posX: 0,
        speed: Math.random() * 2 + .3,
    },
    {
        size: Math.floor(Math.random() * 100) + 10,
        posY: Math.floor(Math.random() * 500) + 50,
        posX: 0,
        speed: Math.random() * 2 + .3,
    },
    {
        size: Math.floor(Math.random() * 100) + 10,
        posY: Math.floor(Math.random() * 500) + 50,
        posX: 0,
        speed: Math.random() * 2 + .3,
    },
    {
        size: Math.floor(Math.random() * 100) + 10,
        posY: Math.floor(Math.random() * 500) + 50,
        posX: 0,
        speed: Math.random() * 2 + .3,
    },
    {
        size: Math.floor(Math.random() * 100) + 10,
        posY: Math.floor(Math.random() * 500) + 50,
        posX: 0,
        speed: Math.random() * 2 + .3,
    },
    {
        size: Math.floor(Math.random() * 100) + 10,
        posY: Math.floor(Math.random() * 500) + 50,
        posX: 0,
        speed: Math.random() * 2 + .3,
    },
    {
        size: Math.floor(Math.random() * 100) + 10,
        posY: Math.floor(Math.random() * 500) + 50,
        posX: 0,
        speed: Math.random() * 2 + .3,
    },
    {
        size: Math.floor(Math.random() * 100) + 10,
        posY: Math.floor(Math.random() * 500) + 50,
        posX: 0,
        speed: Math.random() * 2 + .3,
    },
    {
        size: Math.floor(Math.random() * 100) + 10,
        posY: Math.floor(Math.random() * 500) + 50,
        posX: 0,
        speed: Math.random() * 2 + .3,
    },
    {
        size: Math.floor(Math.random() * 100) + 10,
        posY: Math.floor(Math.random() * 500) + 50,
        posX: 0,
        speed: Math.random() * 2 + .3,
    },
]

// Sets up game variables
const store = Redux.createStore(reducer)
const topOfTheGameBoardpx = 550;
const widthOfTheGameboard = 550;
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
    }

    if(action.type === 'MOVE_UP') {
        newState.spaceShipPosition = newState.spaceShipPosition + 15
        if(newState.spaceShipPosition > topOfTheGameBoardpx) {
            newState.spaceShipPosition = 0
            newState.score = newState.score + 1
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