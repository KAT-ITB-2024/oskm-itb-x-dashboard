"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-2 bg-black">
      <input
        value={email}
        onChange={(v) => setEmail(v.target.value)}
        type="text"
      />
      <input
        value={password}
        onChange={(v) => setPassword(v.target.value)}
        type="password"
      />
      <button
        className="bg-white p-2"
        onClick={async () => {
          const status = await signIn("credentials", {
            email,
            password,
            redirect: false,
          });

          console.log(status);
        }}
      >
        Sign In
      </button>
    </div>
  );
}
