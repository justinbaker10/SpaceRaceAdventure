const express = require('express')
const app = express()
const serv = require('http').Server(app)
const port = 3000

app.use('/', express.static('public'))

serv.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

const io = require('socket.io')(serv,{})
io.sockets.on('connection', (socket) => {
  console.log('connection made')
})
