"use client";
import React from "react";
import Link from "next/link";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { saveAs } from "file-saver";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { RiPencilFill } from "react-icons/ri";
import { MdDelete, MdDownload } from "react-icons/md";
import Search from "./Search";
import Pagination from "./Pagination";
import ConfirmationModal from "./ConfirmationModal";
import { dateWIB } from "~/utils/timeUtils";
import toast from "react-hot-toast";

interface MametAssignmentListProps {
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

export default function MametListAssignment({
  assignments,
  meta,
}: MametAssignmentListProps) {
  const assignmentDeleteMutation =
    api.assignment.deleteAssignmentMamet.useMutation();
  const assignmentCsvMutation =
    api.assignment.getSpecificAssignmentCsv.useMutation();
  const router = useRouter();

  const handleDownloadCsv = async (assignmentId: string) => {
    try {
      const response = await assignmentCsvMutation.mutateAsync({
        assignmentId,
      });

      const { fileName, mimeType, content } = response;

      const blob = new Blob([content], { type: mimeType });
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Error downloading CSV:", error);
      toast.error("Failed to download CSV.");
    }
  };

  const deleteAssignment = async (assignmentId: string) => {
    try {
      await assignmentDeleteMutation.mutateAsync({
        assignmentId,
      });
      toast.success("Berhasil Menghapus Tugas");
      router.refresh();
    } catch (err) {
      toast.error("Gagal Menghapus Tugas");
      console.error("Error deleting assignment : ", err);
    }
  };

  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState<boolean>(false);
  const [assignmentToDelete, setAssignmentToDelete] = React.useState<
    string | null
  >(null);
  const handleDeleteClick = (assignmentId: string) => {
    setAssignmentToDelete(assignmentId);
    setShowConfirmationModal(true);
  };

  const handleConfirmDelete = async () => {
    if (assignmentToDelete) {
      await deleteAssignment(assignmentToDelete);
      setShowConfirmationModal(false);
      setAssignmentToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmationModal(false);
    setAssignmentToDelete(null);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 ">
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
                <TableRow key={index + 1} className="border-2 border-gray-500 ">
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
                    <div className="flex items-center justify-center gap-2 text-2xl">
                      <Link href={`/assignment/edit/${item.assignmentId}`}>
                        <RiPencilFill className="text-[#0010A4]" />
                      </Link>
                      <Button
                        className="bg-transparent text-2xl hover:bg-transparent"
                        onClick={() => handleDeleteClick(item.assignmentId)}
                      >
                        <MdDelete className="text-[#DC2522]" />
                      </Button>
                      <Button
                        className={`bg-transparent text-2xl hover:bg-transparent`}
                        onClick={() => handleDownloadCsv(item.assignmentId)}
                      >
                        <MdDownload className="text-[#3678FF]" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <Pagination meta={meta} />
      {showConfirmationModal && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <ConfirmationModal
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            onClose={handleCancelDelete}
          />
        </div>
      )}
    </div>
  );
}
