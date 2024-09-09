"use client";
import React, { useState } from "react";
import Image from "next/image";
import { MdModeEdit } from "react-icons/md";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { type MenteeAssignment } from "~/server/api/routers/assignment";
import { formatKeterlambatan } from "~/utils/timeUtils";
import Search from "./Search";
import { BiCheck } from "react-icons/bi";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Pagination from "./Pagination";

interface mentorSubmisiPesertaProps {
  assignmentID: string;
  assignmentTitle: string;
  assignmentSubmissions: MenteeAssignment[];
  meta: {
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

const MentorSubmisiPeserta = ({
  assignmentID,
  assignmentTitle,
  assignmentSubmissions,
  meta,
}: mentorSubmisiPesertaProps) => {
  const router = useRouter();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedValue, setEditedValue] = useState<string>("");
  const penilaianSubmisi = assignmentSubmissions.map((submission, index) => {
    const {
      nama,
      nim,
      keterlambatan,
      assignmentSubmissions: submissionDetail,
      linkFile,
      nilai,
    } = submission;

    return {
      no: index + 1,
      name: nama || "Unknown",
      nim: nim || "N/A",
      interval: formatKeterlambatan(keterlambatan),
      status:
        Number(keterlambatan) > 0
          ? "Late"
          : submissionDetail
            ? "Submitted"
            : "Not Submitted",
      nilai: nilai || "0",
      linksubmisi: linkFile,
    };
  });

  const handleEditClick = (
    index: number,
    status: string,
    currentValue: number,
  ) => {
    if (status.toLowerCase() === "not submitted") {
      toast.error("Mentee belum mengumpulkan tugas");
      return;
    }

    setEditingIndex(index);
    setEditedValue(currentValue.toString());
  };

  const editMenteePoints =
    api.assignment.editMenteeAssignmentSubmissionPoint.useMutation();

  const handleSaveClick = async (nim: string) => {
    const updatedValue = parseFloat(editedValue);
    if (!isNaN(updatedValue)) {
      try {
        await editMenteePoints.mutateAsync({
          point: updatedValue,
          assignmentId: assignmentID,
          menteeNim: nim,
        });

        toast.success("Nilai berhasil disimpan");

        router.refresh();
      } catch (error) {
        console.error("Error saving points:", error);
        toast.error("Gagal menyimpan nilai :" + String(error));
      }
    }
    setEditingIndex(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedValue(e.target.value);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <Image
          className="cursor-pointer"
          src={"/in-page/arrow_back_ios.svg"}
          width={24}
          height={24}
          alt="arrow_back"
          onClick={() => router.push("/assignment")}
        />
        <h1 className="ml-4 bg-gradient-to-r from-[#0010A4] to-[#EE1192] bg-clip-text text-[32px] font-bold text-transparent">
          {assignmentTitle}
        </h1>
      </div>
      <Search placeholder="Cari berdasarkan Nama atau NIM" />
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <div className="mt-5 w-full">
          <Table className="border-spacing-0 rounded-lg bg-gradient-to-r from-[#0010A4] to-[#EE1192]">
            <TableHeader className="h-[56px]">
              <TableRow>
                <TableHead
                  style={{ width: "5%" }}
                  className="border-2 border-gray-300 text-center font-bold text-white"
                >
                  No
                </TableHead>
                <TableHead
                  style={{ width: "25%" }}
                  className="border-2 border-gray-300 text-center font-bold text-white"
                >
                  Nama
                </TableHead>
                <TableHead
                  style={{ width: "10%" }}
                  className="border-2 border-gray-300 text-center font-bold text-white"
                >
                  NIM
                </TableHead>
                <TableHead
                  style={{ width: "25%" }}
                  className="border-2 border-gray-300 text-center font-bold text-white"
                >
                  Interval Keterlambatan
                </TableHead>
                <TableHead
                  style={{ width: "15%" }}
                  className="border-2 border-gray-300 text-center font-bold text-white"
                >
                  Status
                </TableHead>
                <TableHead
                  style={{ width: "20%" }}
                  className="border-2 border-gray-300 text-center font-bold text-white"
                >
                  Nilai
                </TableHead>
                <TableHead
                  style={{ width: "10%" }}
                  className="border-2 border-gray-300 text-center font-bold text-white"
                >
                  Open
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {penilaianSubmisi.map((item, index) => (
                <TableRow
                  key={item.no}
                  className="border-2 border-gray-500 text-[16px]"
                >
                  <TableCell className="border-2 border-gray-300 text-center">
                    {item.no}
                  </TableCell>
                  <TableCell className="border-2 border-gray-300">
                    {item.name}
                  </TableCell>
                  <TableCell className="border-2 border-gray-300 text-center">
                    {item.nim}
                  </TableCell>
                  <TableCell className="border-2 border-gray-300 text-center">
                    {item.interval}
                  </TableCell>
                  <TableCell className={`border-2 border-gray-300 text-center`}>
                    <div
                      className={`rounded-lg border-2 p-2 text-center ${
                        item.status.toLowerCase() === "submitted"
                          ? "border-[#05A798] bg-[#C5FFF3] text-[#05A798]"
                          : item.status.toLowerCase() === "late"
                            ? "border-[#F06B02] bg-[#FFD897] text-[#F06B02]"
                            : "border-[#DC2522] bg-[#FFF2F2] text-[#DC2522]"
                      } `}
                    >
                      {item.status}
                    </div>
                  </TableCell>

                  <TableCell className="border-2 border-gray-300 text-center">
                    {editingIndex === index ? (
                      <div className="flex items-center justify-center gap-2">
                        <input
                          type="text"
                          value={editedValue}
                          onChange={handleInputChange}
                          className="rounded-md border border-gray-300 text-center"
                        />
                        <BiCheck
                          onClick={() => handleSaveClick(item.nim)}
                          className="cursor-pointer text-2xl hover:text-green-500"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <p>{item.nilai}</p>
                        <MdModeEdit
                          onClick={() =>
                            handleEditClick(
                              index,
                              item.status,
                              Number(item.nilai),
                            )
                          }
                          className="cursor-pointer"
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="border-2 border-gray-300">
                    {item.linksubmisi ? (
                      <a
                        href={item.linksubmisi}
                        target="_blank"
                        className="flex items-center justify-center"
                      >
                        <Image
                          className="flex items-center justify-center"
                          src={"/in-page/openlink.svg"}
                          width={24}
                          height={24}
                          alt="open link icon"
                        />
                      </a>
                    ) : (
                      <div className="flex items-center justify-center text-gray-400">
                        <Image
                          className="flex items-center justify-center"
                          src={"/in-page/openlink.svg"}
                          width={24}
                          height={24}
                          alt="open link icon"
                        />
                      </div>
                    )}
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
};

export default MentorSubmisiPeserta;
