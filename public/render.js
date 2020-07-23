const socket = io()
let remoteState = {}

const gameID = new URLSearchParams(document.location.search.substring(1)).get('game')
const playerNameBeforeTrunc = new URLSearchParams(document.location.search.substring(1)).get('name')
const playerName = playerNameBeforeTrunc ? playerNameBeforeTrunc.substring(0,8) : null

if(gameID) {
  document.getElementById('waiting-game-number').innerHTML = gameID
  document.getElementById('game-share-link').href = "/?game=" + gameID
}

const gameNodes = {
  pState: {
    local: buildPlayerNodeCollection('local'),
    remote: buildPlayerNodeCollection('remote'),
  },
  waiting: document.querySelector(`.waiting`)
}

function buildPlayerNodeCollection (playerDesignation) {
  return {
    name: document.querySelector(`.${playerDesignation} .name`),
    spaceShip: document.querySelector(`.${playerDesignation} .spaceship`),
    asteroidContainer: document.querySelector(`.${playerDesignation} .asteroid-container`),
    score: document.querySelector(`.${playerDesignation} .scorecard>p`),
    lives: document.querySelector(`.${playerDesignation} .lives`),
    gameOver: document.querySelector(`.${playerDesignation} .gameover`),
    gameBoard: document.querySelector(`.${playerDesignation} .gameboard`),
    messagesBox: document.querySelector(`.${playerDesignation} .messagesbox`),
    gameMessages: document.querySelector(`.${playerDesignation} .gameMessages`)
  }
}

gameNodes.pState.local.spaceShip.addEventListener('animationend',(e)=>{
  store.dispatch({type: "COMPLETE_DEATH_ANIMATION"})
  e.target.classList.remove('death-animation')
})

//needed due to the use of CSS animation to show ship dying.
//clearing the animation has to happen on both local and remote
gameNodes.pState.remote.spaceShip.addEventListener('animationend',(e)=>{
  requestAnimationFrame(()=>(function removeRemoteDeathAnimation (e,count) {
    if(count) {
      requestAnimationFrame(()=>removeRemoteDeathAnimation(e,count-1))
    } else {
      e.target.classList.remove('death-animation')
    }
  })(e,4))
})



// "Subscribing" (updating) the store based on the render function
store.subscribe(render)
const theInitialAction = {type: 'INIT',gameID: gameID,playerName: playerName}
store.dispatch(theInitialAction)

// Game Controls
window.addEventListener('keydown', (e) => {
  const state = store.getState()

  if(gameIsActive(state)) {
    if (e.key === 'ArrowUp') {
        store.dispatch({type: 'MOVE_UP'})
    }

    if (e.key === 'ArrowDown') {
        store.dispatch({type: 'MOVE_DOWN'})
    }
}})

const keyLog = new Array(10)
const theCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]
window.addEventListener('keyup', (e) => {
  keyLog.push(e.key)
  keyLog.shift()

  if((()=>{
    for(let i=0;i<theCode.length;i++) {
      if (keyLog[i] !== theCode[i])  return false
    }
    return true
  })()) {
    store.dispatch({type:"CHEAT"})
    console.log("God Mode enabled. Are you proud of yourself?")
    theCode.push("disable code")
  }
})

// Rendering data (state) from the store to update game
function render () {


    const state = store.getState()
    if(state.multiplayer) {
      document.getElementById('root').classList.add('two-player')
    }

    //do these for each player
    Object.keys(gameNodes.pState).forEach(playerID => {
      if(state[playerID].name && gameNodes.pState[playerID].name.innerHTML !== state[playerID].name) {
        gameNodes.pState[playerID].name.innerHTML = state[playerID].name
      }
      gameNodes.pState[playerID].spaceShip.style.bottom = state[playerID].spaceShipPosition + 'px'
      gameNodes.pState[playerID].score.innerHTML = (typeof state[playerID].score === "number") ? state[playerID].score : ""

      const asteroidStateCopy = state[playerID].asteroidArray && deepCopy(state[playerID].asteroidArray)

      if(asteroidStateCopy) {
        Array.from(gameNodes.pState[playerID].asteroidContainer.children).forEach( (asteroidNode) => {
          const asteroid = asteroidStateCopy[asteroidNode.id]

          if(asteroid) { //if asteroidNode is still in state
            asteroidNode.style.left = `${asteroid.posX - asteroid.size}px`
            if(state[playerID].cheatMode) {
              if(asteroid.posX > (widthOfTheGameboard/2 - widthOfSpaceship/2 - 5)) {
                asteroidNode.style.bottom = '-200px'
              }
              if(asteroid.posX > (widthOfTheGameboard/2 + widthOfSpaceship/2 + 5 + asteroid.size)) {
                asteroidNode.style.bottom = `${asteroid.posY}px`
              }
            }
            delete asteroidStateCopy[asteroidNode.id]
          } else { //if asteroidNode should be deleted
            asteroidNode.remove()
          }

        })

        Object.values(asteroidStateCopy).forEach( (newAsteroid) => { //if asteroid needs to be added
          gameNodes.pState[playerID].asteroidContainer.insertAdjacentHTML('beforeend',
          `<img src="img/asteroid.svg"
          id="${newAsteroid.id}"
          class="asteroids"
          style="left:${newAsteroid.posX - newAsteroid.size}px;
          bottom:${newAsteroid.posY}px;
          height:${newAsteroid.size}px;
          width:${newAsteroid.size}px;">`)
        })

      } else {
        gameNodes.pState[playerID].asteroidContainer.innerHTML = ""
      }

      if(state[playerID].gameIsOver && state.highScores || state[playerID].gameIsOver && playerID === "remote") {
        gameNodes.pState[playerID].gameOver.style.display = "block"
      } else {
        gameNodes.pState[playerID].gameOver.style.display = "none"
      }

      if(levelMessages[state[playerID].score] && playerID == "local") {
        gameNodes.pState[playerID].messagesBox.style.display = "block"
        gameNodes.pState[playerID].messagesBox.innerHTML = levelMessages[state[playerID].score]
      } else {
        gameNodes.pState[playerID].messagesBox.style.display = "none"
      }

      if(state.waitingForPlayers) {
        gameNodes.waiting.style.display = "block"
      } else {
        gameNodes.waiting.style.display = "none"
      }
      if(state[playerID].deathAnimation) {
        gameNodes.pState[playerID].spaceShip.classList.add('death-animation')
      }

      //render lives
      Array.from(gameNodes.pState[playerID].lives.children).forEach( (lifeImg, idx) => {
          if(idx < state[playerID].lives) {
            lifeImg.src = "img/spaceship.svg"
          } else {
            lifeImg.src = "img/empty_life.svg"
          }
      })
    })

    if (state.local.gameIsOver) {
      if(!state.local.scoreSent) {
        store.dispatch({type: "SENT_SCORE"})
        socket.emit('scoreInfo',{
          name: state.local.name,
          score: state.local.score
        })
      }
      if(state.highScores) {
        gameNodes.pState.local.gameOver.querySelector('.high-scores').innerHTML = "<p style='text-decoration:underline;margin-bottom:10px'>High Scores</p>" + state.highScores.map(renderHighScore).join('')
      }
    }
}

function renderHighScore (scoreObj,idx) {
  const info = scoreObj ? `${scoreObj.name} - ${scoreObj.score}` : ''
  return `<p><span>${idx+1})</span><span>${info}</span></p>`
}

// This function takes asteroid data and returns asteroid html
function renderAsteroid (asteroidContainer,asteroid) {
    asteroidContainer.querySelector(`#${asteroid.id}`)

    return `<img
        src="img/asteroid.svg"
        class="asteroids"
        style="left:${asteroid.posX - asteroid.size}px;
            bottom:${asteroid.posY}px;
            height:${asteroid.size}px;
            width:${asteroid.size}px;">`
}

// Animation frame rate creates game timing
requestAnimationFrame(tickClock)
function tickClock () {
  const state = store.getState()
  if(gameIsActive(state)) {
    store.dispatch({type: 'TICK'})
    socket.emit('statePush',{
      state: {...store.getState().local},
      gameID: gameID
    })
  }

  if (state.local.gameIsOver) {
    socket.emit('statePush',{
      state: {...store.getState().local},
      gameID: gameID
    })
  }
  requestAnimationFrame(tickClock)
}

socket.on('startGame', () => {
  store.dispatch({type: 'START_MULTIPLAYER'})
})

socket.on('gameFull', () => {
  console.log('cant join. full.')
})

socket.on('remoteStatePush', (state) => {
  store.dispatch({type: 'TICK_REMOTE',remoteState: state})
})

socket.on('highScores', highScores => {
  store.dispatch({type: 'UPDATE_HIGH_SCORES',highScores: highScores})
})
