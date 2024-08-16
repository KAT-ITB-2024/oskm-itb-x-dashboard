"use client";
import { useState } from "react";
import { api } from "~/trpc/react";

export default function NewPassword({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const [password, setPassword] = useState("");
  const resetPassword = api.user.resetPassword.useMutation();

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-2 bg-black">
      <input
        value={password}
        onChange={(v) => setPassword(v.target.value)}
        type="text"
      />
      <button
        className="bg-white p-2"
        onClick={async () => {
          try {
            await resetPassword.mutateAsync({
              email,
              password,
              token,
            });
          } catch (error) {
            console.log(error);
          }
        }}
      >
        Change Password
      </button>
    </div>
  );
}
