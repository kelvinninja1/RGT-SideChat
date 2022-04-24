import { useUser } from '@auth0/nextjs-auth0'
import React, { useEffect, useState } from 'react'
import { LeftPane, MainPane, BottomPane } from './panes'
import io from 'socket.io-client'

export default function ChatScreen() {
  const { user, error, isLoading } = useUser()
  useEffect(() => {
    if (user) {
      fetch('/api/online').finally(() => {
        const socket = io()

        socket.on('connect', () => {
          console.log('connect')
          socket.emit('online', {
            name: user?.name,
            email: user?.email,
            picture: user?.picture,
          })
        })

        socket.on('a user connected', () => {
          console.log('a user connected')
        })

        socket.on('disconnect', () => {
          console.log('disconnect')
        })
      })
    }
  }, [])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>
  return (
    <div>
      <main className="w-full">
        <h1 className="text-center text-2xl font-bold">SideChat</h1>

        {user && (
          <div>
            <div className="flex w-full">
              <div className="w-1/4">
                <LeftPane />
              </div>
              <div className="w-3/4 ">
                <MainPane />
              </div>
            </div>
            <BottomPane />
          </div>
        )}
      </main>
    </div>
  )
}
