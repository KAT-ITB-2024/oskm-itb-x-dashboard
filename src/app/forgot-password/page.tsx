"use client";
import React from 'react';
import ForgotForm from "./component/ForgotForm";
import NewPassword from "./component/NewPasswordForm";
import { validateToken } from "~/services/forgotToken";

export default async function Page({
  searchParams,
}: {
  searchParams: {
    email?: string;
    token?: string;
  };
}) {
  const { email, token } = searchParams;

  if (email && token) {
    const valid = await validateToken({ email, token }); // Make sure to await this if it's an async function

    if (valid) {
      return (
        <div className="h-screen w-screen overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/img/background.png)' }}>
          <div className="flex items-center justify-center h-full w-full">
            <div className="container mx-auto p-4">
              <NewPassword {...{ email, token }} />
            </div>
          </div>
        </div>
      );
    } else {
      return <div className="h-screen w-screen flex items-center justify-center text-red-500">Invalid or stale token, try again later</div>;
    }
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/img/background.png)' }}>
      <div className="flex items-center justify-center h-full w-full">
        <div className="container mx-auto p-4">
          <ForgotForm />
        </div>
      </div>
    </div>
  );
}