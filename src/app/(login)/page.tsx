import React from "react";
import LoginForm from "./component/LoginForm";
import { getServerAuthSession } from "~/server/auth";

export default async function Page() {
  const session = await getServerAuthSession();
  const user = session?.user;

  const backgroundStyle: React.CSSProperties = {
    backgroundImage: "url(/img/background.png)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    width: "100vw",
    height: "100vh",
  };

  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <div style={backgroundStyle}>
        <div className="flex h-full w-full items-center justify-center">
          <div className="container mx-auto p-4">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
