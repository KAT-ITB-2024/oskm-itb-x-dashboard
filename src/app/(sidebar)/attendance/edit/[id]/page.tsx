import React from "react";

import { getServerAuthSession } from "~/server/auth";
import MametEdit from "./components/MametEdit";
import MentorEdit from "./components/MentorEdit";
import { api } from "~/trpc/server";

interface MenteeData {
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

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { page?: string; query?: string; eventType?: string };
}) {
  const session = await getServerAuthSession();

  const currentPage = Number(searchParams?.page) || 1;
  const search = searchParams?.query ?? "";
  const eventType = searchParams?.eventType ?? "Opening";

  if (!session) {
    return null;
  }

  let menteesData: MenteeData | null = null;
  let metaMentor = {
    page: currentPage,
    totalPages: 1,
    pageSize: 5,
    totalCount: 0,
  };

  let presence = null;
  let group = null;

  const event = await api.event.getEvent({ id: params.id });

  // Mentor Queries
  try {
    const menteeQuery = api.user.detailKelompokMentor({
      userNim: session.user.nim,
      search: search,
      page: currentPage,
    });
    const kelompokQuery = api.user.getMentorGroupName({
      userNim: session.user.nim,
    });

    const [kelompok, mentee] = await Promise.all([kelompokQuery, menteeQuery]);

    group = kelompok;

    menteesData = mentee;
    metaMentor = {
      page: mentee.page,
      totalPages: mentee.totalPage,
      pageSize: mentee.pageSize,
      totalCount: mentee.mentees.length,
    };

    presence = await api.presence.getPresenceOfAGroupInAnEvent({
      eventId: params.id,
      groupName: kelompok!,
      presenceEvent: eventType as "Opening" | "Closing",
      limit: 100,
    });
  } catch (error) {}

  const filteredPresenceData = presence?.data.filter(
    (item) => item.createdAt !== null,
  );

  const presenceData = filteredPresenceData ?? [];

  return (
    <div>
      {session?.user.role === "Mamet" && <MametEdit event={event} />}
      {session?.user.role === "Mentor" && (
        <MentorEdit
          menteesData={menteesData}
          metaMentor={metaMentor}
          group={group}
          event={event}
          presenceData={presenceData}
        />
      )}
    </div>
  );
}
