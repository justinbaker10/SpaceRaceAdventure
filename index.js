const express = require('express')
const app = express()
const serv = require('http').Server(app)
const port = 3333

app.use('/', express.static('public'))

serv.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

const io = require('socket.io')(serv,{})

const socketsList = {}
let scores = new Array(10)

io.sockets.on('connection', (socket) => {
  socket.id = Math.random().toString()
  const gameIDMatch = socket.handshake.headers.referer.match(/game=(\d{4})/)
  socket.game = gameIDMatch ? gameIDMatch[1] : null

  if(socket.game) {
    if(socketsList[socket.game]) {
      const connectionsForGame = Object.values(socketsList[socket.game])
      if(connectionsForGame.length < 2) {
        socket.emit('startGame')
        Object.values(socketsList[socket.game]).forEach( sockIO => {
          sockIO.emit('startGame')
        })
      } else {
        socket.emit('gameFull')
      }
    } else {
      socketsList[socket.game] = {}
    }

    socketsList[socket.game][socket.id] = socket

    socket.on('statePush', body => {
      Object.keys(socketsList[socket.game]).forEach(sockID => {
        if(sockID !== socket.id) {
          socketsList[socket.game][sockID].emit('remoteStatePush',body.state)
        }
      })
    })

    socket.on('disconnect', () => {
      delete socketsList[socket.game][socket.id]
    })
  }

  socket.on('scoreInfo', scoreReport => {
    if(scoreReport) {
      scores.push(scoreReport)
      scores.sort((a,b) =>b.score-a.score)
      scores = scores.slice(0,10)
    }
    socket.emit('highScores',scores)
  })
})
