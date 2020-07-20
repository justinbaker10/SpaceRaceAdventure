
console.log('here')



document.getElementById('two-player-button').addEventListener('click',clickHomepagePlayer)
document.getElementById('single-player-button').addEventListener('click',clickHomepagePlayer)
document.getElementById('playerName').addEventListener('input',updatePlayerName)

function clickHomepagePlayer (playerButtonClickEvent) {
  document.getElementById('two-player-button').classList.remove("selected")
  document.getElementById('single-player-button').classList.remove("selected")
  playerButtonClickEvent.target.classList.toggle("selected")

  document.querySelector('.game-form').style.display = 'block'

  if(playerButtonClickEvent.target.id === 'two-player-button') {
    document.querySelector('.game-number-input').style.display = "block"
  } else {
    document.querySelector('.game-number-input').style.display = "none"
  }
  updateGoLink()
}

function updatePlayerName (e) {
  const validChars = [...e.target.value.matchAll(/[-_a-zA-Z0-9]/g)]
  const modifiedData = validChars.map(ele=>ele[0]).join('')
  e.target.value = modifiedData.substring(0,8)
  updateGoLink()
}

function updateGameNumber (e) {
  const validChars = [...e.target.value.matchAll(/[0-9]/g)]
  const modifiedData = validChars.map(ele=>ele[0]).join('')
  e.target.value = modifiedData.substring(0,4)
  updateGoLink()
}

function updateGoLink () {
  const pName = document.getElementById('playerName').value
  const inputGameNumber = document.getElementById('gameNumber').value
  const randomGameNumber = Math.floor(Math.random()*10000).toString().padStart(4,'0')
  const validGameNumber = isValidGame(inputGameNumber) ? inputGameNumber : randomGameNumber
  const modeSelected = modeSelect()

  if(pName && modeSelected) {
    const gameParam = (modeSelected === 2) ? "&game=" + validGameNumber : ''

    document.getElementById('play-game').href = `/game.html?name=${pName}${gameParam}`
  }
}

function isValidGame (gameNumber) {
  return gameNumber.split('').reduce(acc,char=> {
    if(char.match(/\d/)) {
      return acc && true
    }
    return false
  },true)
}

function modeSelect () {
  const oneIsSelected = document.getElementById('single-player-button').classList.contains('selected')
  const twoIsSelected = document.getElementById('two-player-button').classList.contains('selected')
  return oneIsSelected ?
         1 :
            twoIsSelected ?
             2 :
             null
}
