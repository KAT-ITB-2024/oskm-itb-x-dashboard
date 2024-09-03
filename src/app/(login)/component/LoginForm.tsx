"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPasswordClick = () => {
    router.push("/forgot-password");
  };

  const handleLogin = async () => {
    const status = await signIn("credentials", {
      nim,
      password,
      redirect: false,
    });

    if (status?.ok) {
      toast.success("Berhasil Login");
      router.push("/assignment");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-full max-w-md text-center">
        <div className="flex flex-col items-center">
          <div className="flex -scale-y-100 justify-center">
            <Image
              src="/img/oskmlogo.png"
              alt="OSKM Logo"
              width={130}
              height={130}
            />
          </div>
          <h1
            className="font-mogula text-[42px] font-normal text-[#0010A4]"
          >
            LOGIN
          </h1>
        </div>
        <div className="mt-4 flex w-full flex-col items-start">
          <p className="font-REM mb-1 mt-[-15px] text-sm font-normal text-[#0010A4]">
            NIM <span className="text-[#DC2522]">*</span>
          </p>
          <div className="mb-4 w-full">
            <label htmlFor="Email" className="font-REM sr-only">
              Nim
            </label>
            <div className="flex items-center rounded-lg border border-[#9EA2AD] bg-white">
              <input
                id="Nim"
                type="text"
                value={nim}
                onChange={(v) => setNim(v.target.value)}
                className="h-full w-full rounded-lg bg-white py-2 pl-3 pr-3 text-sm text-black placeholder-gray-500 focus:outline-none"
                placeholder="Masukkan NIM Anda"
              />
            </div>
          </div>

          <p className="font-REM mb-1 text-sm font-normal text-[#0010A4]">
            Kata Sandi <span className="text-[#DC2522]">*</span>
          </p>
          <div className="relative mb-4 w-full">
            <label htmlFor="Kata Sandi" className="font-REM sr-only">
              Kata Sandi
            </label>
            <div className="flex items-center rounded-lg border border-[#9EA2AD] bg-white">
              <input
                id="Kata Sandi"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(v) => setPassword(v.target.value)}
                className="font-REM h-full w-full rounded-lg bg-white py-2 pl-3 pr-10 text-sm text-black placeholder-gray-500 focus:outline-none"
                placeholder="Masukkan Sandi Anda"
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
            onClick={handleLogin}
          >
            Login
          </Button>
          <p
            className="font-REM mt-3 w-full cursor-pointer text-center text-sm text-[#0010A4] underline"
            onClick={handleForgotPasswordClick}
          >
            Lupa kata sandi?
          </p>
        </div>
      </div>
    </div>
  );
}
