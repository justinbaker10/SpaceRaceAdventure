// Query Selectors to access the DOM
let spaceShip = document.querySelector('.spaceship');
let asteroidContainer = document.querySelector('.asteroid-container')
let score = document.querySelector('.scorecard')

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

// Rendering data (state) from the store to update game
function render () {
    const state = store.getState()
    spaceShip.style.bottom = state.spaceShipPosition + 'px'
    score.innerHTML = '<h1>' + state.score + '</h1>'
    asteroidContainer.innerHTML = state.asteroidArray.map(renderAsteroid).join('')
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
