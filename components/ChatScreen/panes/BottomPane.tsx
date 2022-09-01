import { useEffect, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0'
import { Message, OnlineUser } from '../../../types'

export default function BottomPane({
  socket,
  selectedUser,
}: {
  socket: any
  selectedUser: OnlineUser | null
}) {
  const { user, error, isLoading } = useUser()
  const [currentMessage, setCurrentMessage] = useState({} as Message)
  useEffect(() => {
    setCurrentMessage({
      text: '',
      sender: user?.email || '',
      receiver: selectedUser?.email || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }, [selectedUser])

  return (
    <div className="fixed bottom-0 mt-10 mb-2 flex w-3/4 border-t">
      <form
        className="flex-1"
        onSubmit={(e) => {
          e.preventDefault()
          socket?.emit('send_message', {
            ...currentMessage,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          console.log('Sent:', currentMessage)
          setCurrentMessage({
            ...currentMessage,
            text: '',
          })
        }}
      >
        <input
          className="grow rounded-lg border-2 border-gray-400 p-2"
          placeholder="Type an awesome message..."
          type="text"
          value={currentMessage.text}
          onChange={(e) =>
            setCurrentMessage({
              ...currentMessage,
              text: e.target.value,
            })
          }
        />
        <div className="flex-none">
          <button
            className="focus:shadow-outline mr-5 border-none bg-transparent py-2 px-4 text-gray-700 hover:bg-blue-500 hover:text-white focus:outline-none"
            type="submit"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}
