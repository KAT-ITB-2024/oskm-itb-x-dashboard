import DashboardHeader from "~/app/components/DashboardHeader";
import PointList from "./components/PointList";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";

interface GroupInformationsMamet {
  groups: {
    namaKeluarga: string | null;
    jumlahMentee: number;
  }[];
  mentees: {
    nim: string | null;
    nama: string | null;
    fakultas:
      | "FITB"
      | "FMIPA"
      | "FSRD"
      | "FTMD"
      | "FTTM"
      | "FTSL"
      | "FTI"
      | "SAPPK"
      | "SBM"
      | "SF"
      | "SITH"
      | "STEI"
      | null;
    tugasDikumpulkan: number;
    kehadiran: number;
    activityPoints: number | null;
  }[];
  page: number;
  pageSize: number;
}

interface GroupInformationsMentor {
  mentees: GroupInformationsMamet["mentees"];
  page: number;
  pageSize: number;
}

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    group?: string;
    sort?: string;
  };
}) {
  const session = await getServerAuthSession();
  const user = session?.user;

  if (user?.role.toLowerCase() !== "mentor") {
    redirect("/");
  }

  const query = searchParams?.query ?? "";
  const currentPage = Number(searchParams?.page) || 1;

  let groupInformationsMentor: GroupInformationsMentor | null = null;
  let metaMentor = {
    page: currentPage,
    totalPages: 1,
    pageSize: 5,
    totalCount: 0,
  };

  if (!session) {
    return redirect("/");
  }

  try {
    const kelompokMentorQuery = api.user.detailKelompokMentor({
      userNim: session.user.nim,
      page: currentPage,
      search: query,
    });

    const [kelompokMentor] = await Promise.all([kelompokMentorQuery]);

    groupInformationsMentor = kelompokMentor;

    metaMentor = {
      page: kelompokMentor.page,
      totalPages: Math.ceil(kelompokMentor.mentees.length / 5), // Assuming 5 items per page
      pageSize: kelompokMentor.pageSize,
      totalCount: kelompokMentor.mentees.length,
    };
  } catch (error) {
    console.error("Failed to fetch assignments:", error);
  }

  return (
    <div>
      <DashboardHeader title="Gather Points" />
      <PointList
        groupInformations={groupInformationsMentor}
        metaMentor={metaMentor}
      />
    </div>
  );
}
