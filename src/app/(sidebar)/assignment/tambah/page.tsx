import React from "react";
import MametNavigationAssigment from "../components/MametNavigationAssigment";
import DashboardHeader from "~/app/components/DashboardHeader";
import MametAddAssignment from "../components/MametAddAssignment";

export default function page() {
  return (
    <div>
      <div className="flex flex-col gap-4">
        <DashboardHeader title="Add Assignment" />
        <MametNavigationAssigment title="Add Assignment" />
        <MametAddAssignment />
      </div>
    </div>
  );
}
