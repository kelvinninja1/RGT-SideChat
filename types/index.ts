export interface OnlineUser {
  email: string | undefined
  name: string | undefined
  picture: string | undefined
  preferences: {
    blockedUsers: string[]
  }
}

export interface Message {
  text: string
  sender: string
  receiver: string
  createdAt: Date
  updatedAt: Date
}
