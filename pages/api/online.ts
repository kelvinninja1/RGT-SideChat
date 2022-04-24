// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Server, ServerOptions } from 'socket.io'

function removeDuplicates(originalArray: any) {
  let newArray = []
  let uniqueObject: any = {}
  for (let i in originalArray) {
    let objID: string = originalArray[i]['email']
    uniqueObject[objID] = originalArray[i]
  }
  for (let i in uniqueObject) {
    newArray.push(uniqueObject[i])
  }

  return newArray
}

export default function handler(req: NextApiRequest, res: any) {
  const io = new Server(res.socket.server)
  res.socket.server.io = io

  const users: any = {}
  io.on('connection', function (socket) {
    socket.on('online', function (data) {
      users[socket.id] = data
      const userList = removeDuplicates(
        Object.keys(users).map((key) => users[key])
      )
      io.emit('online', userList)
    })

    socket.on('disconnect', function () {
      delete users[socket.id]
      let userList = removeDuplicates(
        Object.keys(users).map((key) => users[key])
      )
      io.emit('online', userList)
    })
  })

  res.end()
}

export const config = {
  api: {
    bodyParser: false,
  },
}
