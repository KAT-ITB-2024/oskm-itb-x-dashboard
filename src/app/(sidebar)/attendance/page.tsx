import React from "react";
import MametListAttendance from "./components/MametListAttendance/MametListAttendance";
import DashboardHeader from "~/app/components/DashboardHeader";
import { getServerAuthSession } from "~/server/auth";
import MentorListAttendance from "./components/MentorListAttendance";
import { api } from "~/trpc/server";

export default async function Page() {
  const session = await getServerAuthSession();

  const events = await api.event.getEvents();

  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader title="Events List" />

      {session?.user.role === "Mamet" && (
        <MametListAttendance events={events} />
      )}

      {session?.user.role === "Mentor" && (
        <MentorListAttendance events={events} />
      )}
    </div>
  );
}
