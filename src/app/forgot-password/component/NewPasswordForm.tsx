"use client";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { api } from "~/trpc/react";

export default function NewPassword({ email, token }: { email: string; token: string }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const resetPassword = api.user.resetPassword.useMutation();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChangePassword = async () => {
    try {
      await resetPassword.mutateAsync({
        email,
        password,
        token,
      });
      console.log("Password changed successfully");
    } catch (error) {
      console.log("Error changing password:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/img/background.png)' }}>
      <div className="text-center">
        <h1 className="text-[42px] font-mogula font-normal text-[#0010A4] text-shadow: 0 0 10px #0010A4">
          Ganti Password
        </h1>
        <div className="flex flex-col items-start mx-6 mt-4">
          <p className="text-[#0010A4] font-REM font-normal mb-1 text-sm">
            Password Baru <span className="text-[#DC2522]">*</span>
          </p>
          <div className="relative w-full mb-4">
            <label htmlFor="password" className="sr-only font-REM">
              Password Baru
            </label>
            <div className="flex items-center border border-[#9EA2AD] rounded-lg px-11 py-2 bg-white">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(v) => setPassword(v.target.value)}
                className="w-full h-full focus:outline-none font-REM text-sm pl-3 pr-10 text-black bg-white placeholder-gray-500"
                placeholder="Masukkan password baru"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-5"
                onClick={handleTogglePassword}
              >
                {showPassword ? (
                  <FaEye className="w-5 h-5 text-[#9EA2AD]" />
                ) : (
                  <FaEyeSlash className="w-5 h-5 text-[#9EA2AD]" />
                )}
              </button>
            </div>
          </div>
          <Button
            className="w-full bg-[#0010A4] text-white font-REM rounded-lg text-sm text-[17px]"
            variant={"link"}
            onClick={handleChangePassword}
          >
            Ganti
          </Button>
        </div>
      </div>
    </div>
  );
}