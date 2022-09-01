// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Server, ServerOptions } from 'socket.io'
import {
  saveMessage,
  getMessages,
  unblockUser,
  blockUser,
  createIndex,
  getBlockedUsers,
} from './_redis'

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

export default async function handler(req: NextApiRequest, res: any) {
  await createIndex()
  const io = new Server(res.socket.server)
  res.socket.server.io = io

  const users: any = {}
  io.on('connection', function (socket) {
    socket.on('online', async function (data) {
      if (!users[socket.id]) {
        // get and add privacy preferences to data
        console.log('User email: '+ data.email)
        await getBlockedUsers(data.email).then((blockedUsers: any) => {
          data = {
            ...data,
            preferences: {
              blockedUsers: [...blockedUsers],
            },
          }
          // if (blockedUsers) {
          //   data.preferences.blockedUsers = blockedUsers
          // }
        })
      }
      users[socket.id] = data
      const userList = removeDuplicates(
        Object.keys(users).map((key) => users[key])
      )
      io.emit('online', userList)

      getMessages(data.email).then((messages) => {
        console.log('Save messages')
        io.emit('saved_messages', messages)
      })
    })

    socket.on('send_message', function (data) {
      saveMessage(data).then(() => {
        io.emit('new_message', data)
      })
    })

    socket.on('block_user', function (data) {
      console.log('User to be blocked')
      blockUser(data.user, data.userToBlock)
        .then(() => {
          console.log('User blocked')
          if (
            users[socket.id].preferences.blockedUsers.includes(data.userToBlock)
          ) {
            users[socket.id].preferences.blockedUsers.push(data.userToBlock)
            let userList = removeDuplicates(
              Object.keys(users).map((key) => users[key])
            )
            io.emit('online', userList)
          }
        })
        .catch((err) => {
          console.log(err)
        })
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
