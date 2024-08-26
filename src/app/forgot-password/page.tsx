"use client";
import React, { useState, useEffect } from "react";
import ForgotForm from "./component/ForgotForm";
import NewPassword from "./component/NewPasswordForm";
import { validateToken } from "~/services/forgotToken";

export default function Page({
  searchParams,
}: {
  searchParams: {
    email?: string;
    token?: string;
  };
}) {
  const { email, token } = searchParams;
  const [loading, setLoading] = useState(true);
  const [validToken, setValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      if (email && token) {
        const valid = await validateToken({ email, token });
        setValidToken(valid);
      } else {
        setValidToken(false);
      }
      setLoading(false);
    };
    checkToken();
  }, [email, token]);

  if (loading) {
    return (
      <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <div style={{
        backgroundImage: 'url(/img/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh',
      }}>
        <div className="flex items-center justify-center h-full w-full">
          <div className="container mx-auto p-4">
            {validToken ? <NewPassword {...{ email, token }} /> : <ForgotForm />}
          </div>
        </div>
      </div>
    </div>
  );
}
