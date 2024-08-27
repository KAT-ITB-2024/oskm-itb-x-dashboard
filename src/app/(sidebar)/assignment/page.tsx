import React from "react";
import MametNavigationAssignment from "./components/MametNavigationAssignment";
import DashboardHeader from "~/app/components/DashboardHeader";
import MametListAssignment from "./components/MametListAssignment";
import MentorListAssignment from "./components/MentorListAssignment";

export default function Page() {
  return (
    <div>
      <div className="flex flex-col gap-4">
        <DashboardHeader title="Assignment List" />
        <MametNavigationAssignment title="Assignment List" />
        {/* <MametListAssignment /> */}
        <MentorListAssignment />
      </div>
    </div>
  );
}
