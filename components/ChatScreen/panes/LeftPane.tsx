import React, { useEffect, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0'
import { OnlineUser } from '../../../types'

export default function LeftPane({
  onlineUsers,
  selectedUser,
  setSelectedUser,
}: {
  onlineUsers: OnlineUser[]
  selectedUser: OnlineUser | null
  setSelectedUser: (user: OnlineUser) => void
}) {
  const { user, error, isLoading } = useUser()
  const [availableUsers, setAvailableUsers] = useState<OnlineUser[]>([])

  useEffect(() => {
    // filter out online users in blockedUsers list
    if (user && user.email) {
      const avail = async () =>
        onlineUsers.filter(
          (onlineUser) =>
            !onlineUser?.preferences?.blockedUsers.includes(
              user.email as string
            )
        )
      avail().then((onlineUsers) => setAvailableUsers(onlineUsers))

      // Compare online users and available users in a console table
      console.log('Unfiltered Online user: ')
      console.table(onlineUsers)
      console.log('Filtered Available user: ')
      console.table(availableUsers)
    }
  }, [onlineUsers])

  const fetchUsers = async (user: any) => {
    setAvailableUsers(
      onlineUsers.filter(
        (onlineUser) =>
          !onlineUser?.preferences?.blockedUsers.includes(user.email as string)
      )
    )
  }

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
            {availableUsers.length > 0 ? (
              availableUsers.map(
                (
                  availableUser: OnlineUser,
                  index: React.Key | null | undefined
                ) => {
                  return (
                    <li
                      key={index}
                      onClick={() => {
                        setSelectedUser(availableUser)
                      }}
                      className={
                        selectedUser?.email === availableUser.email
                          ? 'bg-gray-200'
                          : '' +
                            ' cursor-pointer' +
                            ' py-2 px-4' +
                            ' hover:bg-gray-100' +
                            ' rounded-md' +
                            ' text-sm' +
                            ' text-gray-700' +
                            ' font-semibold' +
                            ' hover:text-gray-900' +
                            ' hover:font-bold' +
                            ' focus:outline-none' +
                            ' focus:text-gray-900' +
                            ' focus:font-bold' +
                            ' focus:bg-gray-100' +
                            ' focus:outline-none' +
                            ' focus:bg-gray-200'
                      }
                    >
                      <div className="flex items-center">
                        <img
                          src={availableUser.picture as string}
                          alt={availableUser.name as string}
                          className="mr-4 h-10 w-10 rounded-full"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold">{availableUser.name}</h4>
                          <p className="text-sm">{availableUser.email}</p>
                        </div>
                      </div>
                    </li>
                  )
                }
              )
            ) : (
              <li className="text-red-400">Awaiting awesome users online</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
