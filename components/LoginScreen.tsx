
import React from "react";

export default function LoginScreen() {
  return (
      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <h1 className="text-6xl font-bold">
              Chat Really great Strangers with{' '}
              <a className="text-blue-600" href="https://nextjs.org">
                  SideChat
              </a>
          </h1>

          <p className="mt-3 text-2xl">
              Wait a minute who are you?{' '}
              <a  href="/api/auth/login" className="rounded-md bg-blue-600 p-3 font-bold text-lg">
                  login
              </a>
          </p>
      </main>
  );
}