"use client";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { api } from "~/trpc/react";

export default function NewPassword({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
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
    <div
      className="flex h-screen w-screen items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/img/background.png)" }}
    >
      <div className="text-center">
        <h1 className="text-shadow: 0 0 10px #0010A4 font-mogula text-[42px] font-normal text-[#0010A4]">
          Ganti Password
        </h1>
        <div className="mx-6 mt-4 flex flex-col items-start">
          <p className="font-REM mb-1 text-sm font-normal text-[#0010A4]">
            Password Baru <span className="text-[#DC2522]">*</span>
          </p>
          <div className="relative mb-4 w-full">
            <label htmlFor="password" className="font-REM sr-only">
              Password Baru
            </label>
            <div className="flex items-center rounded-lg border border-[#9EA2AD] bg-white px-11 py-2">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(v) => setPassword(v.target.value)}
                className="font-REM h-full w-full bg-white pl-3 pr-10 text-sm text-black placeholder-gray-500 focus:outline-none"
                placeholder="Masukkan password baru"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-5"
                onClick={handleTogglePassword}
              >
                {showPassword ? (
                  <FaEye className="h-5 w-5 text-[#9EA2AD]" />
                ) : (
                  <FaEyeSlash className="h-5 w-5 text-[#9EA2AD]" />
                )}
              </button>
            </div>
          </div>
          <Button
            className="font-REM w-full rounded-lg bg-[#0010A4] text-[17px] text-sm text-white"
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
