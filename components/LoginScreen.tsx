import React from 'react'
import Image from 'next/image'

export default function LoginScreen() {
  return (
    <>
      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold">
          Chat Really great Strangers with{' '}
          <a className="text-blue-600" href="https://nextjs.org">
            SideChat
          </a>
        </h1>

        <p className="mt-3 text-2xl">
          Wait a minute who are you?{' '}
          <a
            href="/api/auth/login"
            className="rounded-md bg-blue-600 p-3 text-lg font-bold"
          >
            login
          </a>
        </p>
      </main>
      <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          className="flex items-center justify-center gap-2"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </a>
      </footer>
    </>
  )
}
