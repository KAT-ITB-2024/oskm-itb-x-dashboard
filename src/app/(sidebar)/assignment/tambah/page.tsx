import React from "react";
import MametNavigationAssignment from "../components/MametNavigationAssignment";
import DashboardHeader from "~/app/components/DashboardHeader";
import MametAddAssignment from "../components/MametAddAssignment";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await getServerAuthSession();
  const user = session?.user;

  if (!user) {
    redirect("/");
  }

  if (user.role.toLowerCase() != "mamet") {
    redirect("/assignment");
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        <DashboardHeader title="Add Assignment" />
        <MametNavigationAssignment title="Add Assignment" />
        <MametAddAssignment />
      </div>
    </div>
  );
}
