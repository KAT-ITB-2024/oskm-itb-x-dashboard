  import { getServerAuthSession } from "~/server/auth";
import { NewAssignmentFormClient } from "./NewAssignmentFormClient";


export default async function Page() {
  const session = await getServerAuthSession();
  const user = session?.user;
  console.log(user);

  return (<div>
      <NewAssignmentFormClient/>
    </div>
  )
}
