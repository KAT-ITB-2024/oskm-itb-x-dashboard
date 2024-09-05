import { getServerAuthSession } from "~/server/auth";
import MentorPage from "./components/MentorPage";
import MametPage from "./components/MametPage";
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
  }[];
  page: number;
  pageSize: number;
}

interface GroupInformationsMentor {
  mentees: GroupInformationsMamet["mentees"];
  page: number;
  pageSize: number;
  totalPage: number;
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
  const query = searchParams?.query ?? "";
  const groupName = searchParams?.group ?? "";
  const sortBy = (searchParams?.sort as "nim" | "nama" | undefined) ?? "nim";
  const currentPage = Number(searchParams?.page) || 1;

  let groupInformationsMentor: GroupInformationsMentor | null = null;
  let groupInformationsMamet: GroupInformationsMamet | null = null;
  let metaMentor = {
    page: currentPage,
    totalPages: 1,
    pageSize: 5,
    totalCount: 0,
  };
  let metaMamet = {
    page: currentPage,
    totalPages: 1,
    pageSize: 5,
    totalCount: 0,
  };
  let meta = {
    page: currentPage,
    totalPages: 1,
    pageSize: 5,
    totalCount: 0,
  };

  let group: string | null | undefined = "";

  if (!session) {
    return null;
  }

  try {
    const kelompokMametQuery = api.user.detailKelompokMamet({
      page: currentPage,
      search: query,
      sortOrder: "asc",
      groupName: groupName,
      sortBy: sortBy,
    });

    const tugasQuery = api.assignment.getAllMainAssignment({});

    const [kelompokMamet, allTugas] = await Promise.all([
      kelompokMametQuery,
      tugasQuery,
    ]);

    groupInformationsMamet = kelompokMamet;
    meta = allTugas.meta;

    metaMamet = {
      page: kelompokMamet.page,
      totalPages: 1,
      pageSize: 5,
      totalCount: kelompokMamet.mentees.length,
    };

    groupInformationsMentor = await api.user.detailKelompokMentor({
      userNim: session.user.nim,
      page: currentPage,
      search: query,
    });

    metaMentor = {
      page: groupInformationsMentor.page,
      totalPages: groupInformationsMentor.totalPage,
      pageSize: groupInformationsMentor.pageSize,
      totalCount: groupInformationsMentor.mentees.length,
    };

    group = await api.user.getMentorGroupName({
      userNim: session.user.nim,
    });
  } catch (error) {
    console.error("Failed to fetch assignments:", error);
  }

  return (
    <div>
      {session?.user.role === "Mentor" && (
        <MentorPage
          groupInformations={groupInformationsMentor}
          meta={meta}
          metaMentor={metaMentor}
          group={group}
        />
      )}
      {session?.user.role === "Mamet" && (
        <MametPage
          groupInformations={groupInformationsMamet}
          meta={meta}
          metaMamet={metaMamet}
        />
      )}
    </div>
  );
}
