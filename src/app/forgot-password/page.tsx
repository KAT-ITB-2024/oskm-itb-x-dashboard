import { validateToken } from "~/services/forgotToken";
import ForgotForm from "./component/ForgotForm";
import NewPassword from "./component/NewPasswordForm";

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
    const valid = validateToken({ email, token });

    if (valid) return <NewPassword {...{ email, token }} />;
    else return <div>Invalid or stale token, try again later</div>;
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
            <ForgotForm />
          </div>
        </div>
      </div>
    </div>
  );
}
