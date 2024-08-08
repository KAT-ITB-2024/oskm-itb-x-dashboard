"use client";
import { useState } from "react";
import { api } from "~/trpc/react";

export default function ForgotForm() {
  const [email, setEmail] = useState("");
  const generateForgotPassword = api.user.createForgotToken.useMutation();

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-2 bg-black">
      <input
        value={email}
        onChange={(v) => setEmail(v.target.value)}
        type="text"
      />
      <button
        className="bg-white p-2"
        onClick={async () => {
          try {
            await generateForgotPassword.mutateAsync({ email });
            console.log("Check email (or server log)");
          } catch (error) {
            console.log(error);
          }
        }}
      >
        Forgot Password
      </button>
    </div>
  );
}
