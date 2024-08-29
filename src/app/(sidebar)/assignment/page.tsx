import React from "react";
import MametNavigationAssignment from "./components/MametNavigationAssignment";
import DashboardHeader from "~/app/components/DashboardHeader";
import MametListAssignment from "./components/MametListAssignment";
import MentorListAssignment from "./components/MentorListAssignment";

import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";

interface Assignments {
  judulTugas: string;
  waktuMulai: Date;
  waktuSelesai: Date;
  assignmentId: string;
  downloadUrl: string;
}

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const session = await getServerAuthSession();
  const query = searchParams?.query ?? "";
  const currentPage = Number(searchParams?.page) || 1;

  let assignments: Assignments[] = [];
  let meta = {
    page: currentPage,
    totalPages: 1,
    pageSize: 10,
    totalCount: 0,
  };

  try {
    const response = await api.assignment.getAllMainAssignment({
      page: currentPage,
      searchString: query,
      sortOrder: "asc",
    });

    if (response?.data) {
      assignments = response.data;
      meta = response.meta || meta;
    }
  } catch (error) {
    console.error("Failed to fetch assignments:", error);
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        <DashboardHeader title="Assignment List" />
        {session?.user.role === "Mamet" ? (
          <div>
            <MametNavigationAssignment title="Assignment List" />
            <MametListAssignment assignments={assignments} meta={meta} />
          </div>
        ) : (
          <MentorListAssignment assignments={assignments} meta={meta} />
        )}
      </div>
    </div>
  );
}
