"use client";

import { useState } from "react";
import { IoMdSearch } from "react-icons/io";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { RiPencilFill } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

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
      activityPoints: number | null;
    }[];
    page: number;
    pageSize: number;
  } | null;
  metaMentor: {
    page: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
  };
}

export default function PointList({
  groupInformations,
  metaMentor,
}: GroupInformationMentorProps) {
  const [data, setData] = useState(groupInformations?.mentees ?? []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPoints, setNewPoints] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(metaMentor.page);
  const itemsPerPage = metaMentor.pageSize;

  const filteredData = data.filter(
    (item) =>
      item.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ??
      item.nim?.includes(searchQuery),
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const router = useRouter();

  const editPoints = api.user.editActivityPoints.useMutation();

  const handleSave = async (nim: string) => {
    const points = parseInt(newPoints);
    try {
      await editPoints.mutateAsync({
        userNim: nim,
        activityPoints: points,
      });
      setData((prevData) =>
        prevData.map((item) =>
          item.nim === nim ? { ...item, activityPoints: points } : item,
        ),
      );
      setEditingId(null);
      setNewPoints("");
      router.refresh();
    } catch (error) {
      console.error("Error saving points:", error);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <div className="flex w-full items-center justify-between rounded-lg border-2 border-input bg-white px-6 py-3">
        <input
          type="text"
          placeholder="Cari Mentee"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent outline-none"
        />
        <IoMdSearch className="text-xl text-gray-400" />
      </div>
      <Table className="border-spacing-0 rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="rounded-tl-lg">No</TableHead>
            <TableHead>NIM</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Poin Tambahan</TableHead>
            <TableHead className="rounded-tr-lg">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((item, index) => (
            <TableRow key={item.nim}>
              <TableCell>
                {index + 1 + (currentPage - 1) * itemsPerPage}
              </TableCell>
              <TableCell>{item.nim}</TableCell>
              <TableCell>{item.nama}</TableCell>
              <TableCell>
                {editingId === item.nim ? (
                  <input
                    type="text"
                    value={newPoints}
                    onChange={(e) => setNewPoints(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 text-center"
                  />
                ) : (
                  item.activityPoints
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2 text-2xl">
                  {editingId === item.nim ? (
                    <FaCheck
                      className="cursor-pointer text-[#0010A4] hover:text-[#00A86B]"
                      onClick={() => handleSave(item.nim ?? "")}
                    />
                  ) : (
                    <RiPencilFill
                      className="cursor-pointer text-[#0010A4]"
                      onClick={() => {
                        setEditingId(item.nim);
                        setNewPoints(item.activityPoints?.toString() ?? "");
                      }}
                    />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <nav className="flex flex-row items-center gap-3">
        <p className="text-[#EE1192]">Total {filteredData.length} Items</p>
        <ul className="flex h-6 items-center gap-3 -space-x-px text-base">
          <li>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex h-6 items-center justify-center rounded-md bg-[#EE1192] px-2 text-white disabled:bg-gray-400"
            >
              <span className="sr-only">Previous</span>
              <svg
                className="h-2 w-2 rtl:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
                aria-hidden="true"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
            </button>
          </li>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li key={page}>
              <button
                onClick={() => handlePageChange(page)}
                className={`flex h-6 items-center justify-center rounded-md px-2 ${
                  currentPage === page
                    ? "bg-[#EE1192] text-white"
                    : "border bg-white text-[#EE1192]"
                }`}
              >
                {page}
              </button>
            </li>
          ))}

          <li>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex h-6 items-center justify-center rounded-md bg-[#EE1192] px-2 text-white disabled:bg-gray-400"
            >
              <span className="sr-only">Next</span>
              <svg
                className="h-2 w-2 rtl:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
                aria-hidden="true"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
            </button>
          </li>
        </ul>
        <p className="rounded-md border px-3.5 text-center">
          <span className="text-gray-500">{itemsPerPage}</span> / page
        </p>
      </nav>
    </div>
  );
}
