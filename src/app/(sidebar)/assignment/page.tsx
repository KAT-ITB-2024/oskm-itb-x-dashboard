import React from "react";
import MametNavigationAssignment from "./components/MametNavigationAssignment";
import DashboardHeader from "~/app/components/DashboardHeader";
import MametListAssignment from "./components/MametListAssignment";

export default function Page() {
  return (
    <div>
      <div className="flex flex-col gap-4">
        <DashboardHeader title="Assignment List" />
        <MametNavigationAssignment title="Assignment List" />
        <MametListAssignment />
      </div>
    </div>
  );
}
