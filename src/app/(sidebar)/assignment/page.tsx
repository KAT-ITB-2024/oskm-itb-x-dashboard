import React from "react";
import MametNavigationAssignment from "./components/MametNavigationAssignment";
import DashboardHeader from "~/app/components/DashboardHeader";
import MametListAssignment from "./components/MametListAssignment";
// import MentorListAssignment from "./components/MentorListAssignment";

import { api } from "~/trpc/server";

interface Assignments {
  judulTugas: string;
  waktuMulai: Date;
  waktuSelesai: Date;
  assignmentId: string;
}

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query ?? "";
  const currentPage = Number(searchParams?.page) || 1;

  const response = await api.assignment.getAllMainAssignmentMentor({
    page: currentPage,
    searchString: query,
    sortOrder: "asc",
  });

  const assignments: Assignments[] = response.data;
  const meta = response.meta;
  return (
    <div>
      <div className="flex flex-col gap-4">
        <DashboardHeader title="Assignment List" />
        <MametNavigationAssignment title="Assignment List" />
        <MametListAssignment assignments={assignments} meta={meta} />
      </div>
      {/* <MentorListAssignment /> */}
    </div>
  );
}
