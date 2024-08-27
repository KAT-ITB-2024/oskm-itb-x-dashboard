"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
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
      email,
      password,
      redirect: false,
    });

    console.log(status);
  };

  return (
    <div className="login-container flex items-center justify-center h-screen">
      <div className="login-box text-center">
        <div className="flex flex-col items-center">
          <div className="flex justify-center">
            <Image
              src="/img/oskmlogo.png"
              alt="OSKM Logo"
              width={130}
              height={130}
            />
          </div>
          <h1
            className="
              text-[42px]
              font-mogula
              font-normal
              text-[#0010A4]
              text-shadow: 0 0 10px #0010A4
              mt-[-20px]"
          >
            LOGIN
          </h1>
        </div>
        <div className="flex flex-col items-start mx-6 mt-4">
          <p className="text-[#0010A4] font-REM font-normal mb-1 mt-[-15px] text-sm">
            Email <span className="text-[#DC2522]">*</span>
          </p>
          <div className="w-full mb-4">
            <label htmlFor="Email" className="sr-only font-REM">
              Email
            </label>
            <div className="flex items-center border border-[#9EA2AD] rounded-lg px-11 py-2 bg-white">
              <input
                id="Email"
                type="text"
                value={email}
                onChange={(v) => setEmail(v.target.value)}
                className="w-full h-full focus:outline-none font-REM text-sm pl-3 pr-3 text-black bg-white placeholder-gray-500"
                placeholder="Masukkan Email Anda"
              />
            </div>
          </div>

          <p className="text-[#0010A4] font-REM font-normal mb-1 text-sm">
            Kata Sandi <span className="text-[#DC2522]">*</span>
          </p>
          <div className="relative w-full mb-4">
            <label htmlFor="Kata Sandi" className="sr-only font-REM">
              Kata Sandi
            </label>
            <div className="flex items-center border border-[#9EA2AD] rounded-lg px-11 py-2 bg-white">
              <input
                id="Kata Sandi"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(v) => setPassword(v.target.value)}
                className="w-full h-full focus:outline-none font-REM text-sm pl-3 pr-10 text-black bg-white placeholder-gray-500"
                placeholder="Masukkan Sandi Anda"
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
            onClick={handleLogin}
          >
            Login
          </Button>
          <p
            className="mt-3 text-sm text-[#0010A4] font-REM underline cursor-pointer text-center w-full"
            onClick={handleForgotPasswordClick}
          >
            Lupa kata sandi?
          </p>
        </div>
      </div>
    </div>
  );
}