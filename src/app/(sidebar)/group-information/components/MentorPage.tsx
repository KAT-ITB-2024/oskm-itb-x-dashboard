"use client";

import React, { useEffect, useState } from "react";
import DashboardHeaderGroup from "~/app/components/DashboardHeaderGroup";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import Search from "./Search";
import Pagination from "./Pagination";

interface GroupInformationMentorProps {
  groupInformations: {
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
  } | null;
  meta: {
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  metaMentor: {
    page: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
  };
  group: string | null | undefined;
}

function MentorPage({
  groupInformations,
  meta,
  metaMentor,
  group,
}: GroupInformationMentorProps) {
  const [data, setData] = useState(groupInformations?.mentees ?? []);

  useEffect(() => {
    setData(
      groupInformations?.mentees.slice(
        (metaMentor.page - 1) * metaMentor.pageSize,
        metaMentor.page * metaMentor.pageSize,
      ) ?? [],
    );
  }, [groupInformations, metaMentor.page, metaMentor.pageSize]);

  return (
    <>
      <DashboardHeaderGroup
        title="Group Information"
        group={group?.split("-").join(" ") ?? "Keluarga 0"}
      />

      <div className="flex w-full flex-col items-center justify-center gap-4">
        <Search placeholder="Cari Mentee..." />

        <Table className="border-spacing-0 rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="rounded-tl-lg">No</TableHead>
              <TableHead>NIM</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Fakultas</TableHead>
              <TableHead>Jumlah Tugas</TableHead>
              <TableHead className="rounded-tr-lg">Kehadiran</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.nim}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.nim}</TableCell>
                <TableCell>{item.nama}</TableCell>
                <TableCell>{item.fakultas}</TableCell>
                <TableCell
                  className={cn(
                    Math.floor(
                      (item.tugasDikumpulkan / meta.totalCount) * 100,
                    ) <= 100 && "text-[#18A348]",
                    Math.floor(
                      (item.tugasDikumpulkan / meta.totalCount) * 100,
                    ) <= 70 && "text-[#D8760A]",
                    Math.floor(
                      (item.tugasDikumpulkan / meta.totalCount) * 100,
                    ) <= 30 && "text-[#DC2522]",
                  )}
                >
                  {item.tugasDikumpulkan}/{meta.totalCount}
                </TableCell>
                <TableCell
                  className={cn(
                    Math.floor((item.kehadiran / 8) * 100) <= 100 &&
                      "text-[#18A348]",
                    Math.floor((item.kehadiran / 8) * 100) <= 70 &&
                      "text-[#D8760A]",
                    Math.floor((item.kehadiran / 8) * 100) <= 30 &&
                      "text-[#DC2522]",
                  )}
                >
                  {Math.floor((item.kehadiran / 8) * 100)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Pagination meta={metaMentor} />
      </div>
    </>
  );
}

export default MentorPage;
