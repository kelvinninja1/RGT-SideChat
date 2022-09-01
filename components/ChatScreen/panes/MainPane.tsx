import { useEffect, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0'
import { Message, OnlineUser } from '../../../types'

export default function MainPane({
  children,
  selectedUser,
  setSelectedUser,
  messages,
  socket,
}: {
  children: any
  selectedUser: OnlineUser | null
  setSelectedUser: (user: OnlineUser) => void
  messages: Message[]
  socket: any
}) {
  const { user, error, isLoading } = useUser()
  const [currentMessages, setCurrentMessages] = useState([] as Message[])
  useEffect(() => {
    if (selectedUser) {
      setCurrentMessages(
        messages.filter(
          (message) =>
            (message.receiver == selectedUser?.email &&
              message.sender == user?.email) ||
            (message.receiver == user?.email &&
              message.sender == selectedUser?.email)
        )
      )
    }
  }, [selectedUser, messages])

  // If selected user is null, show startup view
  if (selectedUser === null) {
    return (
      <div className="mt-10 flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-3xl font-bold">Welcome to the SideChat!</h1>
        <p className="mt-3 text-2xl">
          Please select a user to start chatting with.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex">
        <img
          src={selectedUser.picture}
          alt={selectedUser.name}
          className="mr-4 h-10 w-10 rounded-full"
        />{' '}
        <h1 className="pt-1 text-2xl font-bold">
          SideChat with{' '}
          <span className="text-blue-600">{selectedUser.name}</span>
        </h1>
        <button
          className="ml-auto rounded bg-red-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          onClick={() => {
            console.log('clicked')
            socket?.emit('block_user', {
              user: user?.email,
              userToBlock: selectedUser?.email,
            })
          }}
        >
          Block
        </button>
      </div>
      <div className="my-20">
        {
          // Map throw Messages
          // Show received messages on the left in gray chat bubbles
          //  Show sent messages on the right in blue chat bubbles

          currentMessages.length > 0 ? (
            currentMessages.map((message) => {
              if (message.sender == user?.email) {
                return (
                  <div className="flex flex-row-reverse">
                    <div className="m-1 mr-4 rounded-lg bg-blue-200 p-2">
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                )
              } else {
                return (
                  <div className="flex">
                    <div className="m-1 ml-4 rounded-lg bg-gray-200 p-2">
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                )
              }
            })
          ) : (
            <div className="mt-10 flex flex-col items-center justify-center">
              <h1 className="rounded-2xl bg-gray-100 px-5 text-gray-500">
                No messages yet, Be the first to say Hi
              </h1>
            </div>
          )
        }
      </div>
      {children}
    </div>
  )
}
