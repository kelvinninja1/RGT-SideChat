import type { NextPage } from 'next'
import Head from 'next/head'
import { useUser } from '@auth0/nextjs-auth0'
import React, { useEffect, useState } from 'react'
import ChatScreen from '../components/ChatScreen'
import LoginScreen from '../components/LoginScreen'
import io from 'socket.io-client'

const Home: NextPage = () => {
  const { user, error, isLoading } = useUser()
  const [hello, setHello] = useState('')

  useEffect(() => {
    const socket = io({ ['transports']: ['websocket'] })
    socket.on('now', (data) => {
      setHello(data.message)
    })
  }, [])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  return (
    <div className="flex flex-col p-2">
      <Head>
        <title>SideChat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {user ? <ChatScreen /> : <LoginScreen />}
      {hello}
    </div>
  )
}

export default Home
