import Link from "next/link";
import React from "react";
import { IoChevronBackSharp } from "react-icons/io5";
import DashboardHeader from "~/app/components/DashboardHeader";
import MametFormAttendance from "../../../components/MametFormAttendance";

interface Event {
  id: string;
  day: string;
  eventDate: Date;
  openingOpenPresenceTime: string;
  closingOpenPresenceTime: string;
  openingClosePresenceTime: string;
  closingClosePresenceTime: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MametEditProps {
  event: Event | undefined;
}

function MametEdit({ event }: MametEditProps) {
  return (
    <>
      <DashboardHeader title="Edit Event" />
      <Link href="/attendance" className="my-6 flex items-center gap-3">
        <IoChevronBackSharp className="cursor-pointer text-2xl text-[#0010A4]" />
        <h1 className="w-fit bg-gradient-to-r from-[#0010A4] to-[#EE1192] bg-clip-text text-3xl font-bold text-transparent">
          Edit Event
        </h1>
      </Link>
      <MametFormAttendance event={event} />
    </>
  );
}

export default MametEdit;
