let spaceShip = document.querySelector('.spaceship');
let asteroidContainer = document.querySelector('.asteroid-container')
let score = document.querySelector('.scorecard')
store.subscribe(render)
const theInitialAction = {type: 'INIT'}
store.dispatch(theInitialAction)

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        store.dispatch({type: 'MOVE_UP'})
    }

    if (e.key === 'ArrowDown') {
        store.dispatch({type: 'MOVE_DOWN'})
    }
})

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

requestAnimationFrame(myFunc);

function myFunc () {
    store.dispatch({type: 'TICK'})
    requestAnimationFrame(myFunc)
}
