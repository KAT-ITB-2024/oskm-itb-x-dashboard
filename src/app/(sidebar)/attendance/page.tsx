"use client"
import React from "react";
import MametListAttendance from "./components/MametListAttendance/MametListAttendance";
import DashboardHeader from "~/app/components/DashboardHeader";

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