// Query Selectors to access the DOM
let spaceShip = document.querySelector('.spaceship');
let asteroidContainer = document.querySelector('.asteroid-container')
let score = document.querySelector('.scorecard')
let asteroidBox = document.querySelector('.asteroid-box')
let shipBox = document.querySelector('.ship-box')
let oneLife = document.querySelector('.lives')
let gameOver = document.querySelector('.gameover')
let gameBoard = document.querySelector('.gameboard')
let shakeButton = document.querySelector('.shakebutton')

// "Subscribing" (updating) the store based on the render function
store.subscribe(render)
const theInitialAction = {type: 'INIT'}
store.dispatch(theInitialAction)

// Game Controls
window.addEventListener('keydown', (e) => {
  const state = store.getState()
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
    spaceShip.style.bottom = state.spaceShipPosition + 'px'
    score.innerHTML = '<h1>' + state.score + '</h1>'
    asteroidContainer.innerHTML = state.asteroidArray.map(renderAsteroid).join('')
    if(state.gameIsActive === false) {
      gameOver.style.display = "initial"
    }

    //render lives
    Array.from(oneLife.children).forEach( (lifeImg, idx) => {
        if(idx < state.lives) {
          lifeImg.src = "img/spaceship.svg"
        } else {
          lifeImg.src = "img/empty_life.svg"
        }
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

// Animates asteroids
requestAnimationFrame(tickClock);

function tickClock () {
    const state = store.getState()
    store.dispatch({type: 'TICK'})
    if(state.gameIsActive === true) {
      requestAnimationFrame(tickClock)
    }
}
