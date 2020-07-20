// Specifies initial game state
const initialState = {
  local: {
    name: '',
    score: 0,
    spaceShipPosition: 0,
    asteroidArray: [],
    lives: 3,
    gameIsOver: false
  },
  remote: {},
  waitingForPlayers: false,
  matchIsOver: false,
  multiplayer: null,
  highScores: null
}

function gameIsActive (state) {
  if(state.local.gameIsOver === false &&
     state.waitingForPlayers === false &&
     state.matchIsOver === false) {
       return true
  }
  return false
}

// Asteroid size of size 109 moves at .4, Asteroid of size 10 moves at 5
// m = -0.0465
// b = 5.465
function createNewAsteroid () {
    const size = Math.floor(Math.random() * 100) + 10
    return  {
        size: size,
        posY: Math.floor(Math.random() * 500) + 60,
        posX: Math.floor(Math.random() * 500),
        speed: -0.0465 * size + 5.465
    }
}

function linearRegression (x1, x2, y1, y2) {
    const m = (y2-y1) / (x2-x1)
    const b = y1 - m * x1
    return function(x) {
        return m * x + b
    }
}

function calcAsteroidSpeed (size) {
    const minSpeed = 0.5
    const maxSpeed = 4
    const minSize = 10
    const maxSize = 109
    const asteroidSpeedRegression = linearRegression(minSize, maxSize, minSpeed, maxSpeed)

    return asteroidSpeedRegression(size)
}

function createAsteroidArray (score) {
    const asteroidArray = []
    for (i = 0; i < score; i++) {
        asteroidArray.push(createNewAsteroid())
    }
    return asteroidArray
}

function hasSpaceshipCollided (playerState) {
    for(i = 0; i < playerState.asteroidArray.length; i++) {
        if(hasOverlap(getSpaceshipBox(playerState), getAsteroidBox(playerState, i))) {
            return true
        }
    }
    return false
}

function getSpaceshipBox (playerState) {
    const theRadius = widthOfSpaceship / 2
    return {
        radius: theRadius,
        x: widthOfTheGameboard / 2,
        y: topOfTheGameBoardpx - playerState.spaceShipPosition - theRadius
    }
}


function getAsteroidBox (playerState, asteroidIndex) {
    const theAsteroid = playerState.asteroidArray[asteroidIndex]
    const theRadius = theAsteroid.size / 2
    return {
        radius: theRadius,
        x: theAsteroid.posX - theRadius,
        y: topOfTheGameBoardpx - theAsteroid.posY - theRadius
    }
}


function hasOverlap (circle1, circle2) {
    var dx = circle1.x - circle2.x;
    var dy = circle1.y - circle2.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < circle1.radius + circle2.radius) {
        return true
    }
    return false
}


// Sets up game variables
const store = Redux.createStore(reducer)
const topOfTheGameBoardpx = 600;
const widthOfTheGameboard = 600;
const widthOfSpaceship = 50;
const heightOfSpaceship = 50;
const maxAsteroidXValue = widthOfTheGameboard + 200;

// Updates game data (state)
function reducer (oldState, action) {
    if(oldState === undefined) oldState = initialState
    const newState = deepCopy(oldState)

    if(action.type === 'INIT') {
      if(action.gameID === null) {
        newState.multiplayer = false
      } else {
        newState.waitingForPlayers = true
        newState.multiplayer = true
      }
      if(action.playerName === null) {
        newState.local.name = 'anon'
      } else {
        newState.local.name = action.playerName
      }
    }

    if(action.type === 'START_MULTIPLAYER') {
        newState.waitingForPlayers = false
    }

    if(action.type === 'UPDATE_HIGH_SCORES') {
      newState.highScores = action.highScores
    }

    if(action.type === 'TICK') {
        newState.remote = action.remoteState
        newState.local.asteroidArray = newState.local.asteroidArray.reduce(function(newAsteroids, asteroid) {
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

        if(hasSpaceshipCollided(newState.local)) {
            newState.local.spaceShipPosition = 0
            newState.local.lives = newState.local.lives - 1
            if(newState.local.lives === 0) {
                newState.local.gameIsOver = true
                newState.local.asteroidArray = []
            }
        }
    }

    if(action.type === 'MOVE_UP') {
        newState.local.spaceShipPosition = newState.local.spaceShipPosition + 15
        if(newState.local.spaceShipPosition > topOfTheGameBoardpx) {
            newState.local.spaceShipPosition = 0
            newState.local.score = newState.local.score + 1
            newState.local.asteroidArray = createAsteroidArray(newState.local.score)
        }
    }

    else if(action.type === 'MOVE_DOWN') {
        newState.local.spaceShipPosition = newState.local.spaceShipPosition - 15
        if(newState.local.spaceShipPosition < 0) {
            newState.local.spaceShipPosition = 0
        }
    }

    return newState
}

function deepCopy (obj1) {
    return JSON.parse(JSON.stringify(obj1))
}
