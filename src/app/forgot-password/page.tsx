import ForgotForm from "./component/ForgotForm";
import NewPassword from "./component/NewPasswordForm";
import { validateToken } from "~/server/api/routers/forgot";

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
    <div>
      <ForgotForm />
    </div>
  );
}
