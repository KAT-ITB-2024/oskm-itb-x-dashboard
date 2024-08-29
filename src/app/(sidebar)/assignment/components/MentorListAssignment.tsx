"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import Image from "next/image";
import { Button } from "~/components/ui/button";

import Search from "./Search";
import Pagination from "./Pagination";

import { downloadFile } from "~/utils/fileUtils";
import { dateWIB } from "~/utils/timeUtils";

import { saveAs } from "file-saver";

interface MentorAssignmentListProps {
  assignments: {
    judulTugas: string;
    waktuMulai: Date;
    waktuSelesai: Date;
    assignmentId: string;
    downloadUrl: string;
  }[];
  meta: {
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export default function MentorListAssignment({
  assignments,
  meta,
}: MentorAssignmentListProps) {
  const handleDownload = async (downloadUrl: string, judulTugas: string) => {
    if (downloadUrl) {
      const fileBob = await downloadFile(downloadUrl);
      saveAs(fileBob, judulTugas);
    }
  };
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <div className="flex w-full flex-col items-center justify-center">
        <Search placeholder="Cari Tugas..." />
        <div className="mt-3 w-full">
          <Table className="border-spacing-0 rounded-lg bg-gradient-to-r from-[#0010A4] to-[#EE1192]">
            <TableHeader className="h-[56px]">
              <TableRow>
                <TableHead
                  style={{ width: "5%" }}
                  className="border-2 border-gray-300 text-center font-bold text-white"
                >
                  No.
                </TableHead>
                <TableHead
                  style={{ width: "33%" }}
                  className="border-2 border-gray-300 text-center font-bold text-white"
                >
                  Judul
                </TableHead>
                <TableHead
                  style={{ width: "22%" }}
                  className="border-2 border-gray-300 text-center font-bold text-white"
                >
                  Waktu Mulai
                </TableHead>
                <TableHead
                  style={{ width: "22%" }}
                  className="border-2 border-gray-300 text-center font-bold text-white"
                >
                  Waktu Selesai
                </TableHead>
                <TableHead
                  style={{ width: "18%" }}
                  className="border-2 border-gray-300 text-center font-bold text-white"
                >
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {assignments.map((item, index) => (
                <TableRow key={index} className="border-2 border-gray-500 ">
                  <TableCell className="border-2 border-gray-300 text-center">
                    {index + 1}
                  </TableCell>
                  <TableCell className="border-2 border-gray-300 text-[16px]">
                    {item.judulTugas}
                  </TableCell>
                  <TableCell className="border-2 border-gray-300">
                    {dateWIB(item.waktuMulai)}
                  </TableCell>
                  <TableCell className="border-2 border-gray-300">
                    {dateWIB(item.waktuSelesai)}
                  </TableCell>
                  <TableCell className="border-2 border-gray-300">
                    <Button
                      className="flex w-full items-center justify-center bg-transparent hover:bg-transparent"
                      onClick={() =>
                        handleDownload(item.downloadUrl, item.judulTugas)
                      }
                      disabled={!item.downloadUrl}
                    >
                      <Image
                        className="flex items-center justify-center"
                        src={"/in-page/openlink.svg"}
                        width={24}
                        height={24}
                        alt="open link icon"
                      />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <Pagination meta={meta} />
    </div>
  );
}
