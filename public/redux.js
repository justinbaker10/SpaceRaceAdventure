// Specifies initial game state
const initialState = {
  local: {
    name: '',
    score: 0,
    spaceShipPosition: 0,
    asteroidArray: {},
    lives: 3,
    gameIsOver: false,
    scoreSent: false,
    deathAnimation: false
  },
  remote: {},
  waitingForPlayers: false,
  matchIsOver: false,
  multiplayer: null,
  highScores: null
}

const levelMessages = {
    0: `Use arrows to move Spaceship!`,
    5: `Pretty easy so far? Just wait..`,
    15: `How's it going?`,
    25: `Not bad...`,
    40: `You're cheating right?`,
    80: `WTF`,
    100: `Okay calm down man`
}

function gameIsActive (state) {
  if(state.local.gameIsOver === false &&
     state.local.deathAnimation === false &&
     state.waitingForPlayers === false &&
     state.matchIsOver === false) {
       return true
  }
  return false
}

// Asteroid size of size 109 moves at .4, Asteroid of size 10 moves at 6
function createNewAsteroid () {
    const size = Math.floor(Math.random() * 100) + 10
    return  {
        id: UUID(),
        size: size,
        posY: Math.floor(Math.random() * 500) + 60,
        posX: Math.floor(Math.random() * 500),
        speed: calcAsteroidSpeed(size)
    }
}

//from S.O.
function UUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function linearRegression (x1, x2, y1, y2) {
    const m = (y2-y1) / (x2-x1)
    const b = y1 - m * x1
    return function(x) {
        return m * x + b
    }
}

function calcAsteroidSpeed (size) {
    const minSpeed = .5
    const maxSpeed = 6
    const minSize = 10
    const maxSize = 109
    const asteroidSpeedRegression = linearRegression(maxSize, minSize, minSpeed, maxSpeed)

    return asteroidSpeedRegression(size)
}

function createAsteroidArray (score) {
    const asteroidArray = {}
    for (i = 0; i < score; i++) {
        const newAsteroid = createNewAsteroid()
        asteroidArray[newAsteroid.id] = newAsteroid
    }
    return asteroidArray
}

function hasSpaceshipCollided (playerState) {
    const asteroidObjects = Object.values(playerState.asteroidArray)
    for(let i = 0; i<asteroidObjects.length; i++) {
      if(hasOverlap(getSpaceshipHitBox(playerState), getAsteroidHitBox(playerState, asteroidObjects[i].id))) {
        return true
      }
    }
    return false
}

function getSpaceshipHitBox (playerState) {
    const theRadius = widthOfSpaceship / 2
    return {
        radius: theRadius,
        x: widthOfTheGameboard / 2,
        y: topOfTheGameBoardpx - playerState.spaceShipPosition - theRadius
    }
}


function getAsteroidHitBox (playerState, asteroidID) {
    const theAsteroid = playerState.asteroidArray[asteroidID]
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

    if(action.type === 'TICK_REMOTE') {
      newState.remote = action.remoteState
    }

    if(action.type === 'TICK') {
        newState.local.asteroidArray = Object.values(newState.local.asteroidArray).reduce(function(newAsteroids, asteroid) {
            if(asteroid.posX < widthOfTheGameboard + asteroid.size) {
                asteroid.posX = asteroid.posX + asteroid.speed
            }
            else {
                asteroid.posX = 0
            }
            newAsteroids[asteroid.id] = asteroid
            return newAsteroids
        },{})

        if(hasSpaceshipCollided(newState.local) && CHEAT_CODE !== GOD_MODE) {
            newState.local.lives = newState.local.lives - 1
            newState.local.deathAnimation = true
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

    else if (action.type === "SENT_SCORE") {
      newState.local.scoreSent = true
    }

    else if (action.type === "COMPLETE_DEATH_ANIMATION") {
      newState.local.deathAnimation = false
      newState.local.spaceShipPosition = 0
      if(newState.local.lives === 0) {
          newState.local.gameIsOver = true
          newState.local.asteroidArray = {}
      }
    }

    return newState
}

function deepCopy (obj1) {
    return JSON.parse(JSON.stringify(obj1))
}
