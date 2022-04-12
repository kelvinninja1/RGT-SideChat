import {useUser} from "@auth0/nextjs-auth0";
import React from "react";

export default function ChatScreen() {
    const { user, error, isLoading } = useUser();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;
  return (
    <div>
      <h1>ChatScreen</h1>
        <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
            <p className="mt-3 text-2xl">
                <a  href="/api/auth/logout" className="rounded-md bg-blue-600 p-3 font-bold text-lg">
                    logout
                </a>
            </p>

            { user && (
            <div>
                <img src={user.picture as string} alt={user.name as string} />
                <h2>{user.name}</h2>
                <p>{user.email}</p>
            </div>
            ) }
        </main>
    </div>

  );
}