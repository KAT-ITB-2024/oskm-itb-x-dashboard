import { getServerAuthSession } from "~/server/auth";
import MentorPage from "./components/MentorPage";
import MametPage from "./components/MametPage";

export default async function Page() {
  const session = await getServerAuthSession();

  return (
    <div>
      {session?.user.role === "Mentor" && <MentorPage />}
      {session?.user.role === "Mamet" && <MametPage />}
    </div>
  );
}
