// Query Selectors to access the DOM
let spaceShip = document.querySelector('.spaceship');
let asteroidContainer = document.querySelector('.asteroid-container')
let score = document.querySelector('.scorecard')
let asteroidBox = document.querySelector('.asteroid-box')
let shipBox = document.querySelector('.ship-box')

// "Subscribing" (updating) the store based on the render function
store.subscribe(render)
const theInitialAction = {type: 'INIT'}
store.dispatch(theInitialAction)

// Game Controls
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        store.dispatch({type: 'MOVE_UP'})
    }

    if (e.key === 'ArrowDown') {
        store.dispatch({type: 'MOVE_DOWN'})
    }
})

console.log(asteroidBox)

// Rendering data (state) from the store to update game
function render () {
    const state = store.getState()
    spaceShip.style.bottom = state.spaceShipPosition + 'px'
    score.innerHTML = '<h1>' + state.score + '</h1>'
    asteroidContainer.innerHTML = state.asteroidArray.map(renderAsteroid).join('')
    /*
    if(state.asteroidBox) {
      asteroidBox.style.top = Math.floor(state.asteroidBox.y1) + 'px'
      asteroidBox.style.height = Math.floor(state.asteroidBox.y2 - state.asteroidBox.y1) + 'px'
      asteroidBox.style.left = Math.floor(state.asteroidBox.x1) + 'px'
      asteroidBox.style.width = Math.floor(state.asteroidBox.x2 - state.asteroidBox.x1) + 'px'
    }
    if(state.shipBox) {
      shipBox.style.top = Math.floor(state.shipBox.y1) + 'px'
      shipBox.style.height = Math.floor(state.shipBox.y2 - state.shipBox.y1) + 'px'
      shipBox.style.left = Math.floor(state.shipBox.x1) + 'px'
      shipBox.style.width = Math.floor(state.shipBox.x2 - state.shipBox.x1) + 'px'
    }
    */
   if(state.iDied) {
       requestAnimationFrame(function() {
           alert('I died..')
       })
   }
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
requestAnimationFrame(myFunc);

function myFunc () {
    store.dispatch({type: 'TICK'})
    requestAnimationFrame(myFunc)
}
