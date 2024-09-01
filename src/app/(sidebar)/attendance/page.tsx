import React from "react";
import MametListAttendance from "./components/MametListAttendance/MametListAttendance";
import DashboardHeader from "~/app/components/DashboardHeader";
import { getServerAuthSession } from "~/server/auth";
import MentorListAttendance from "./components/MentorListAttendance";

export default async function Page() {
  const session = await getServerAuthSession();

  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader title="Events List" />

      {session?.user.role === "Mamet" && <MametListAttendance />}

      {session?.user.role === "Mentor" && <MentorListAttendance />}
    </div>
  );
}
