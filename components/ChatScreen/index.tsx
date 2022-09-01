import { useUser } from '@auth0/nextjs-auth0'
import React, { useEffect, useState } from 'react'
import { LeftPane, MainPane, BottomPane } from './panes'
import io from 'socket.io-client'
import { OnlineUser } from '../../types'

export default function ChatScreen() {
  const { user, error, isLoading } = useUser()
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const [selectedUser, setSelectedUser] = useState<OnlineUser | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [socket, setSocket] = useState<any | null>(null)
  // const [socketConnected, setSocketConnected] = useState(false)

  useEffect(() => {
    // const socket = io().connect('/api/online')
    // setSocket(socket)
    // fetch('/api/online')
    //   .then(() => {
    // const socket = io().connect('/')
    // setSocket(socket)
    //
    //     // socket?.on('connect', async () => {
    //     //   console.log('connect')
    //     //   socket?.emit('online', {
    //     //     name: user?.name,
    //     //     email: user?.email,
    //     //     picture: user?.picture,
    //     //   })
    //     // })
    //     //
    //     // socket?.on('online', (data: OnlineUser[]) => {
    //     //   setOnlineUsers(
    //     //     data.filter((onlineUser) => onlineUser.email !== user?.email)
    //     //   )
    //     // })
    //     //
    //     // socket?.on('new_message', (data) => {
    //     //   setMessages((messages) => [...messages, data])
    //     // })
    //     //
    //     // socket?.on('saved_messages', (data) => {
    //     //   setMessages(data)
    //     // })
    //     //
    //     // socket?.on('disconnect', () => {
    //     //   console.log('disconnect')
    //     // })
    // })
    // .catch(() => {
    //   console.log("Kelvin, couldn't connect to the server")
    // })

    const socket = io('http://localhost:3000', {
      transports: ['websocket'],
      path: '/api/online',
    })
    setSocket(socket)
  }, [])

  useEffect(() => {
    console.log('Kelvin, useEffect')
    if (!socket) return

    socket.on('connect', async () => {
      console.log('connect')
      if (!socket.connected) return
      socket.emit('online', {
        name: user?.name,
        email: user?.email,
        picture: user?.picture,
      })
    })

    if (!socket.connected) return

    socket.on('online', (data: OnlineUser[]) => {
      setOnlineUsers(
        data.filter((onlineUser) => onlineUser.email !== user?.email)
      )
    })

    socket.on('new_message', (data: any) => {
      setMessages((messages) => [...messages, data])
    })

    socket.on('saved_messages', (data: any) => {
      setMessages(data)
    })

    socket.on('disconnect', () => {
      console.log('disconnect')
    })
  }, [socket])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>
  return (
    <div>
      <main className="w-full">
        {user && (
          <div>
            <div className="flex w-full">
              <div className="w-1/4">
                <LeftPane
                  onlineUsers={onlineUsers}
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                />
              </div>
              <div className="w-3/4 ">
                <MainPane
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                  messages={messages}
                  socket={socket}
                >
                  {' '}
                  <BottomPane
                    socket={socket}
                    selectedUser={selectedUser}
                  />{' '}
                </MainPane>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
