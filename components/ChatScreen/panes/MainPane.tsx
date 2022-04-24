import { useState } from 'react'

type OnlineUser = {
  email: string | undefined
  activeSessions: number | undefined
  blockedUsers: string[] | undefined
  createdAt: Date | undefined
  updatedAt: Date | undefined
}

export default function MainPane() {
  const [selectedUser, setSelectedUser] = useState<OnlineUser | null>(null)

  // If selected user is null, show startup view
  if (selectedUser === null) {
    return (
      <div>
        <h1>Welcome to the chat!</h1>
        <p>Please select a user to start chatting with.</p>
      </div>
    )
  }

  // If selected user is not null, show chat view
  return (
    <div>
      <h1>Chat with {selectedUser.email}</h1>
      <p>
        You are chatting with {selectedUser.email} who has{' '}
        {selectedUser.activeSessions} active sessions.
      </p>
    </div>
  )
}
