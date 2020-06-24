let modifier = 10;

let spaceShip = document.querySelector('.spaceship');

let gameState = {
    spaceShipY: 0
}

function setSpaceShipPosition () {
    spaceShip.style.bottom = gameState.spaceShipY + 'px'
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        gameState.spaceShipY = gameState.spaceShipY + modifier
        setSpaceShipPosition()
    }

    if (e.key === 'ArrowDown') {
        gameState.spaceShipY = gameState.spaceShipY - modifier
        setSpaceShipPosition()
    }
})