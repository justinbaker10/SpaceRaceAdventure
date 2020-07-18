// Query Selectors to access the DOM


const gameNodes = {
  local: buildPlayerNodeCollection('local'),
  remote: buildPlayerNodeCollection('remote')
}

function buildPlayerNodeCollection (playerDesignation) {
  return {
    spaceShip: document.querySelector(`.${playerDesignation} .spaceship`),
    asteroidContainer: document.querySelector(`.${playerDesignation} .asteroid-container`),
    score: document.querySelector(`.${playerDesignation} .scorecard>p`),
    lives: document.querySelector(`.${playerDesignation} .lives`),
    gameOver: document.querySelector(`.${playerDesignation} .gameover`),
    gameBoard: document.querySelector(`.${playerDesignation} .gameboard`)
  }
}

// "Subscribing" (updating) the store based on the render function
store.subscribe(render)
const theInitialAction = {type: 'INIT'}
store.dispatch(theInitialAction)

// Game Controls
window.addEventListener('keydown', (e) => {
  const state = store.getState().local
  if(state.gameIsActive === true) {
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
    Object.keys(gameNodes).forEach(playerID => {
      gameNodes[playerID].spaceShip.style.bottom = state[playerID].spaceShipPosition + 'px'
      gameNodes[playerID].score.innerHTML = state[playerID].score
      gameNodes[playerID].asteroidContainer.innerHTML = state[playerID].asteroidArray.map(renderAsteroid).join('')
      if(state[playerID].gameIsActive === false) {
        gameNodes[playerID].gameOver.style.display = "initial"
      }

      //render lives
      Array.from(gameNodes[playerID].lives.children).forEach( (lifeImg, idx) => {
          if(idx < state[playerID].lives) {
            lifeImg.src = "img/spaceship.svg"
          } else {
            lifeImg.src = "img/empty_life.svg"
          }
      })
    })
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
requestAnimationFrame(tickClock);
function tickClock () {
    store.dispatch({type: 'TICK'})
    requestAnimationFrame(tickClock)
}


document.querySelector('.toggle-two-player').addEventListener('click',()=>{
  const theRootDiv = document.getElementById('root')
  if(theRootDiv.classList.contains('two-player')) {
    theRootDiv.classList.remove('two-player')
  } else {
    theRootDiv.classList.add('two-player')
  }
})
