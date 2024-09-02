import React from "react";
import DashboardHeader from "~/app/components/DashboardHeader";
import MentorSubmisiPeserta from "../../components/MentorSubmisiPeserta";
import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { type User } from "@katitb2024/database";
import { type MenteeAssignment } from "~/server/api/routers/assignment";

export default async function Page({
  params,
  searchParams
}: {
  params: {
    id: string;
  };
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const session = await getServerAuthSession();
  const { nim } = session?.user as User;

  const query = searchParams?.query ?? "";
  const currentPage = Number(searchParams?.page) || 1;

  let assignmentSubmissions: MenteeAssignment[] = [];
  let meta = {
    page: currentPage,
    totalPages: 1,
    pageSize: 10,
    totalCount: 0,
  };

  try {
    const response = await api.assignment.getMenteeAssignmentSubmission({
      assignmentId: params.id,
      mentorNim: nim,
      page: currentPage,
      pageSize: 10,
      searchString: query,
    });

    console.log("response", response);

    if (response?.data) {
      assignmentSubmissions = response.data as MenteeAssignment[];
      meta = response.meta || meta;
      meta.totalCount = response.data.length;
    }
  } catch (error) {
    console.error("Failed to fetch assignmentSubmissions:", error);
  }

  const { data } = await api.assignment.getAssignmentDetail({
    assignmentId: params.id,
  });

  const assignmentTitle = data?.judulTugas || "Assignment X";

  return (
    <div>
      <div className="flex flex-col gap-4 ">
        <DashboardHeader title="Penilaian Assignment" />
        <MentorSubmisiPeserta
          assignmentID={params.id}
          assignmentTitle={assignmentTitle}
          assignmentSubmissions={assignmentSubmissions}
          meta={meta}
        />
      </div>
    </div>
  );
}
