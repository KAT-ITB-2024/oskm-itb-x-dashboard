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

interface MenteePoints {
  id: number;
  nim: string;
  name: string;
  points: number;
}

const dummyData: MenteePoints[] = [
  { id: 1, nim: "18221157", name: "Cathleen Laureta", points: 100 },
  { id: 2, nim: "18221158", name: "John Doe", points: 120 },
  { id: 3, nim: "18221159", name: "Jane Smith", points: 90 },
  // Add more dummy data as needed
];

export default function PointList() {
  const [data, setData] = useState<MenteePoints[]>(dummyData);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newPoints, setNewPoints] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalItems = data.length;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Fetch or update your data based on the new page number
    }
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
    const currentItem = data.find((item) => item.id === id);
    if (currentItem) {
      setNewPoints(currentItem.points.toString());
    }
  };

  const handleSave = (id: number) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, points: parseInt(newPoints) } : item,
      ),
    );
    setEditingId(null);
    setNewPoints("");
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <div className="flex w-full items-center justify-between rounded-lg border-2 border-input bg-white px-6 py-3">
        <input
          type="text"
          placeholder="Cari Mentee"
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
          {data.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.nim}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                {editingId === item.id ? (
                  <input
                    type="text"
                    value={newPoints}
                    onChange={(e) => setNewPoints(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 text-center"
                  />
                ) : (
                  item.points
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2 text-2xl">
                  {editingId === item.id ? (
                    <FaCheck
                      className="cursor-pointer text-[#0010A4] hover:text-[#00A86B]"
                      onClick={() => handleSave(item.id)}
                    />
                  ) : (
                    <RiPencilFill
                      className="cursor-pointer text-[#0010A4]"
                      onClick={() => handleEdit(item.id)}
                    />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <nav className="flex flex-row items-center gap-3">
        <p className="text-[#EE1192]">Total {totalItems} Items</p>
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
