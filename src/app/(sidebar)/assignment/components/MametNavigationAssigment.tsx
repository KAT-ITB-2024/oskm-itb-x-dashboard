"use client";
import React from "react";
import MametListAssignment from "./MametListAssignment";
import MametAddAssignment from "./MametAddAssignment";
import DashboardHeader from "~/app/components/DashboardHeader";

export default function MametNavigationAssigment() {
  const [checked, setChecked] = React.useState<string>("Assignment List");

  const handleToggle = (value: string) => {
    setChecked(value);
  };
  return (
    <>
      <DashboardHeader title="Assignment" />
      <div className="flex w-full">
        <div
          aria-checked={checked === "Assignment List"}
          className={`flex h-12 w-1/2 cursor-pointer items-center justify-center rounded-l-lg border-2 font-bold ${
            checked === "Assignment List"
              ? "border-0 bg-gradient-to-r from-[#0010A4] to-[#EE1192] text-white"
              : "text-[#0010A4]"
          }`}
          onClick={() => handleToggle("Assignment List")}
        >
          Daftar Tugas
        </div>
        <div
          aria-checked={checked === "Add Assignment"}
          className={`flex h-12 w-1/2 cursor-pointer items-center justify-center rounded-r-lg border-2 font-bold ${
            checked === "Add Assignment"
              ? "border-0 bg-gradient-to-r from-[#0010A4] to-[#EE1192] text-white"
              : "text-[#0010A4]"
          }`}
          onClick={() => handleToggle("Add Assignment")}
        >
          Tambah Tugas
        </div>
      </div>
      {checked === "Assignment List" ? (
        <MametListAssignment />
      ) : (
        <MametAddAssignment />
      )}
    </>
  );
}
