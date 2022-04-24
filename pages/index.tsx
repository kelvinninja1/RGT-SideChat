import type { NextPage } from 'next'
import Head from 'next/head'
import { useUser } from '@auth0/nextjs-auth0'
import React from 'react'
import ChatScreen from '../components/ChatScreen'
import LoginScreen from '../components/LoginScreen'

const Home: NextPage = () => {
  const { user, error, isLoading } = useUser()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  return (
    <div className="flex flex-col p-2">
      <Head>
        <title>SideChat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {user ? <ChatScreen /> : <LoginScreen />}
    </div>
  )
}

export default Home
