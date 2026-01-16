"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Profile() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name || "");

  if (!session) return <p>Please sign in</p>;

  const saveProfile = async () => {
    await update({ name });
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-4">Profile</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="border p-2 rounded mb-4"
      />
      <button onClick={saveProfile} className="bg-blue-500 text-white p-2 rounded">
        Save
      </button>
      <p>Wallet: {session.user?.walletAddress}</p>
    </div>
  );
}