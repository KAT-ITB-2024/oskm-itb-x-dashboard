import { getServerAuthSession } from "~/server/auth";
import LoginForm from "./component/LoginForm";

export default async function Page() {
  const session = await getServerAuthSession();
  const user = session?.user;
  console.log(user);

  return <LoginForm />;
}
