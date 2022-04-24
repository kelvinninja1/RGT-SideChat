import React, { useEffect, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0'
import io from 'socket.io-client'

type OnlineUser = {
  email: string | undefined
  name: string | undefined
  picture: string | undefined
}

export default function LeftPane() {
  const { user, error, isLoading } = useUser()
  const [onlineUsers, setOnlineUsers] = useState([])
  useEffect(() => {
    if (user) {
      fetch('/api/online').finally(() => {
        const socket = io()

        socket.on('online', (data) => {
          setOnlineUsers(data)
        })
      })
    }
  }, [])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>
  if (!user) return <div>Not logged in</div>
  if (!onlineUsers) return <div>...</div>

  return (
    <div className="">
      <div className="r">
        <div className="">
          {user && (
            <div>
              <img
                className="mr-4 h-10 w-10 rounded-full"
                src={user?.picture as string}
                alt={user?.name as string}
              />
              <h2 className="font-extrabold">{user.name}</h2>
              <h3 className="font-light">{user.email}</h3>
              <p className="mt-3">
                <a
                  href="/api/auth/logout"
                  className="rounded-md bg-gray-300 p-1 font-bold"
                >
                  logout
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="">
        <div className="border-t-gray-500 pt-5">
          <h3 className="font-bold">Online Users</h3>
          <ul>
            {onlineUsers.length > 0 ? (
              onlineUsers.map(
                (
                  onlineUser: OnlineUser,
                  index: React.Key | null | undefined
                ) => {
                  return (
                    <li key={index}>
                      <div className="flex items-center">
                        <img
                          src={onlineUser.picture as string}
                          alt={onlineUser.name as string}
                          className="mr-4 h-10 w-10 rounded-full"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold">{onlineUser.name}</h4>
                          <p className="text-sm">{onlineUser.email}</p>
                        </div>
                      </div>
                    </li>
                  )
                }
              )
            ) : (
              <li className="text-red-400">No users online</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
