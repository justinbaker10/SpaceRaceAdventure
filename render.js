let spaceShip = document.querySelector('.spaceship');
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
    spaceShip.style.bottom = store.getState().spaceShipPosition + 'px'
    score.innerHTML = '<h1>' + store.getState().score + '</h1>'
}