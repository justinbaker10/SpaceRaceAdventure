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
    gameBoard: document.querySelector(`.${playerDesignation} .gameboard`)
  }
}

gameNodes.pState.local.spaceShip.addEventListener('animationend',(e)=>{
  store.dispatch({type: "COMPLETE_DEATH_ANIMATION"})
  e.target.classList.remove('death-animation')
})

gameNodes.pState.remote.spaceShip.addEventListener('animationend',(e)=>{
  e.target.classList.remove('death-animation')
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
      gameNodes.pState[playerID].asteroidContainer.innerHTML = (state[playerID].asteroidArray) ? state[playerID].asteroidArray.map(renderAsteroid).join('') : ""
      if(state[playerID].gameIsOver && state.highScores) {
        gameNodes.pState[playerID].gameOver.style.display = "block"
      } else {
        gameNodes.pState[playerID].gameOver.style.display = "none"
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
function renderAsteroid (asteroid) {
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
