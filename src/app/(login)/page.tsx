  import { getServerAuthSession } from "~/server/auth";
import NewAssignmentForm from "./NewAssignmentForm";

export default async function Page() {
  const session = await getServerAuthSession();
  const user = session?.user;
  console.log(user);

  return (<div>
      <NewAssignmentForm/>
    </div>
  )
}
