import React from "react";
import MametNavigationAssigment from "./components/MametNavigationAssigment";
import DashboardHeader from "~/app/components/DashboardHeader";
import MametListAssignment from "./components/MametListAssignment";

export default function Page() {
  return (
    <div>
      <div className="flex flex-col gap-4">
        <DashboardHeader title="Assignment List" />
        <MametNavigationAssigment title="Assignment List" />
        <MametListAssignment />
      </div>
    </div>
  );
}
