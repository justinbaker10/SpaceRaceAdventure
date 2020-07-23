# SpaceRace Adventure

![alt tag](https://i.imgur.com/dexnt67.png)
A multiplayer arcade game where you play a lonely spaceship from a far away galaxy. But be wary of those pesky asteroids!

## Built With

- HTML
- CSS
- Redux
- Node.js
- Express
- Socket.io

## Demo

[SpaceRace Adventure](https://space-race.xyz/)

## How it works

<b>Spaceship</b>

When the player presses the "ArrowUp" or "ArrowDown" key, the store dispatches the "MOVE_UP" and "MOVE_DOWN" action.

```

window.addEventListener('keydown', (e) => {
  const state = store.getState()

  if(gameIsActive(state) === true) {
    if (e.key === 'ArrowUp') {
        store.dispatch({type: 'MOVE_UP'})
    }

    if (e.key === 'ArrowDown') {
        store.dispatch({type: 'MOVE_DOWN'})
    }
}})

```

Then those action types move the spaceship either up or down 15 pixels on the gameboard! Take that tesla!

```
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
```

<b>Asteroids</b>

The number of asteroids generated is based on the level you are on. The size, as well as the X and Y positions of the asteroids are generated at random using `Math.floor(Math.random())`.

```

function createNewAsteroid () {
    const size = Math.floor(Math.random() * 100) + 10
    return  {
        size: size,
        posY: Math.floor(Math.random() * 500) + 60,
        posX: Math.floor(Math.random() * 500),
        speed: calcAsteroidSpeed(size)
    }
}

function createAsteroidArray (score) {
    const asteroidArray = []
    for (i = 0; i < score; i++) {
        asteroidArray.push(createNewAsteroid())
    }
    return asteroidArray
}

```

The speed however, is based on the size using a linear regression equation. (The smaller the asteroid, the faster it moves)

```

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

```

The asteroids are then animated using `requestAnimationFrame`

```

requestAnimationFrame(tickClock);
function tickClock () {
  const state = store.getState()
    store.dispatch({type: 'TICK',remoteState: remoteState})
    if(gameIsActive(state)) {
      socket.emit('statePush',{
        state: {...store.getState().local},
        gameID: gameID
      })
    }
    requestAnimationFrame(tickClock)
}

```

<b>Collisions</b>

The collision engine, like any other, is based off of hitboxes. (In our case, circle hitboxes)

```

function getSpaceshipHitBox (playerState) {
    const theRadius = widthOfSpaceship / 2
    return {
        radius: theRadius,
        x: widthOfTheGameboard / 2,
        y: topOfTheGameBoardpx - playerState.spaceShipPosition - theRadius
    }
}


function getAsteroidHitBox (playerState, asteroidIndex) {
    const theAsteroid = playerState.asteroidArray[asteroidIndex]
    const theRadius = theAsteroid.size / 2
    return {
        radius: theRadius,
        x: theAsteroid.posX - theRadius,
        y: topOfTheGameBoardpx - theAsteroid.posY - theRadius
    }
}

```

The game then checks for collisions every tick.

```

if(hasSpaceshipCollided(newState.local)) {
    newState.local.spaceShipPosition = 0
    newState.local.lives = newState.local.lives - 1
    if(newState.local.lives === 0) {
        newState.local.gameIsOver = true
        newState.local.asteroidArray = []
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

```

## Cheat code

If you REALLY find this game too difficult, or you want to challenge a friend to an unwinnable match, simply enter the Konami Code ftw.

## Created by

<b>Justin Baker</b>
[Github](https://github.com/justinbaker10)
[Website](https://justinrbaker.com/)

<b>Aubrey Snider</b>
[Github](https://github.com/aurmer)
[Website](https://aurmer.com/)
