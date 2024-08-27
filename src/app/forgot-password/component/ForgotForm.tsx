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
      console.log("Check email (or server log)");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="forgot-container flex items-center justify-center h-screen">
      <div className="forgot-box text-center">
        <div className="flex flex-col items-center">
          <h1 className="text-[42px] font-mogula font-normal text-[#0010A4] leading-none">
            LUPA<br/>KATA SANDI?
          </h1>
          <p className="text-[15px] font-REM font-normal text-[#0010A4] mt-[20px]">
            Tenang saja, Aqualings!
          </p>
        </div>
        <div className="flex flex-col items-start mx-6 mt-10">
          <p className="text-[#0010A4] font-REM font-normal mb-1 mt-[-15px] text-sm">
            Email <span className="text-[#DC2522]">*</span>
          </p>
          <div className="w-full mb-4">
            <label htmlFor="email" className="sr-only font-REM">Email</label>
            <div className="flex items-center border border-[#9EA2AD] rounded-lg px-11 py-2 bg-white">
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  console.log("Email updated:", e.target.value);
                }}
                className="w-full h-full focus:outline-none font-REM text-sm pl-3 pr-3 text-black bg-white placeholder-gray-500"
                placeholder="Masukkan Email Anda"
              />
            </div>
          </div>
          <Button
            className="w-full bg-[#0010A4] text-white font-REM rounded-lg text-sm text-[17px]"
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
