"use client";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export default function ForgotForm() {
  const [email, setEmail] = useState("");
  const generateForgotPassword = api.user.createForgotToken.useMutation();

  const handleForgotPassword = async () => {
    try {
      await generateForgotPassword.mutateAsync({ email });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="forgot-container flex h-screen items-center justify-center">
      <div className="forgot-box text-center">
        <div className="flex flex-col items-center">
          <h1 className="font-mogula text-[42px] font-normal leading-none text-[#0010A4]">
            LUPA
            <br />
            KATA SANDI?
          </h1>
          <p className="font-REM mt-[20px] text-[15px] font-normal text-[#0010A4]">
            Tenang saja, Aqualings!
          </p>
        </div>
        <div className="mx-6 mt-10 flex flex-col items-start">
          <p className="font-REM mb-1 mt-[-15px] text-sm font-normal text-[#0010A4]">
            Email <span className="text-[#DC2522]">*</span>
          </p>
          <div className="mb-4 w-full">
            <label htmlFor="email" className="font-REM sr-only">
              Email
            </label>
            <div className="flex items-center rounded-lg border border-[#9EA2AD] bg-white px-11 py-2">
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="font-REM h-full w-full bg-white pl-3 pr-3 text-sm text-black placeholder-gray-500 focus:outline-none"
                placeholder="Masukkan Email Anda"
              />
            </div>
          </div>
          <Button
            className="font-REM w-full rounded-lg bg-[#0010A4] text-[17px] text-sm text-white"
            variant={"link"}
            onClick={handleForgotPassword}
          >
            Kirim
          </Button>
        </div>
      </div>
    </div>
  );
}
