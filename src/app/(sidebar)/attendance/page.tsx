import React from "react";
// import MametNavigationAssignment from "./components/MametNavigationAssignment";
import DashboardHeader from "~/app/components/DashboardHeader";
import MametListAttendance from "./components/MametAttendance/MametAttendance";

// import { EventActions } from "./components/MametNavigationList";

export default function Page() {
  return (
    <div>
      <div className="flex flex-col gap-4">
        <DashboardHeader title="Attendance List" />
        <MametListAttendance/>

      </div>
    </div>
  );
}