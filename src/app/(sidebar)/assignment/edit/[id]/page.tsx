import React from "react";
import Link from "next/link";

import { IoChevronBackSharp } from "react-icons/io5";

import DashboardHeader from "~/app/components/DashboardHeader";
import MametEditAssignment from "../../components/MametEditAssignment";

import { api } from "~/trpc/server";
import type { AssignmentType } from "@katitb2024/database";

interface Assignment {
  data: {
    assignmentId: string;
    judulTugas: string;
    deskripsi: string;
    waktuMulai: Date;
    waktuSelesai: Date;
    assignmentType: AssignmentType;
    point: number;
    filename: string;
    downloadUrl: string;
  };
}

export default async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const assignment: Assignment = await api.assignment.getAssignmentDetail({
    assignmentId: params.id,
  });
  return (
    <>
      <DashboardHeader title="Edit Assignment" />
      <Link href="/assignment" className="my-6 flex items-center gap-3">
        <IoChevronBackSharp className="cursor-pointer text-2xl text-[#0010A4]" />
        <h1 className="w-fit bg-gradient-to-r from-[#0010A4] to-[#EE1192] bg-clip-text text-3xl font-bold text-transparent">
          Edit Tugas
        </h1>
      </Link>
      <MametEditAssignment assignment={assignment.data} />
    </>
  );
}
