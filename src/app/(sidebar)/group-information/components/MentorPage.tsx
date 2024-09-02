"use client";

import React from "react";
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
}

function MentorPage({
  groupInformations,
  meta,
  metaMentor,
}: GroupInformationMentorProps) {
  return (
    <>
      <DashboardHeaderGroup title="Group Information" group="Keluarga 72" />

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
            {groupInformations?.mentees.map((item, index) => (
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
