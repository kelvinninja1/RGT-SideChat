import { NextApiRequest, NextApiResponse } from 'next'

const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

const port = process.env.PORT || 3000

io.on('connect', (socket: any) => {
  socket.emit('now', {
    message: 'Zeit',
  })
})

nextApp.prepare().then(() => {
  app.get('*', (req: NextApiRequest, res: NextApiResponse) => {
    return nextHandler(req, res)
  })
  server.listen(port, (err: any) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
