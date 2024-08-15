"use client";
import React from "react";
import Link from "next/link";

import { IoChevronBackSharp } from "react-icons/io5";

import DashboardHeader from "~/app/components/DashboardHeader";
import MametFormAttendance from "../components/MametFormAttendance";

export default function Page() {
  return (
    <>
      <DashboardHeader title="Add Event" />
      <Link href="/attendance" className="my-6 flex items-center gap-3">
        <IoChevronBackSharp className="cursor-pointer text-2xl text-[#0010A4]" />
        <h1 className="w-fit bg-gradient-to-r from-[#0010A4] to-[#EE1192] bg-clip-text text-3xl font-bold text-transparent">
          Add Event 
        </h1>
      </Link>
      <MametFormAttendance/>
    </>
  );
}