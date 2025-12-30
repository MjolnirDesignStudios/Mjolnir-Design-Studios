"use client";

import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { Web3Button } from "@web3auth/ui";

export default function SignIn() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  if (session) return <p>Signed in as {session.user?.email}</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <button onClick={() => signIn("google")} className="mb-4 p-4 border rounded">
        Sign in with Google
      </button>
      <Web3Button
        clientId={process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!}
        onLogin={(user) => {
          // Handle Web3 login
          signIn("credentials", { address: user.address, signature: user.signature });
        }}
        theme="light"
      />
    </div>
  );
}