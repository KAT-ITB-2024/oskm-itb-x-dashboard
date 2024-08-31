"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import Pagination from "./paginationTable";
import SearchBar from "./searchBarTable";
import { FiExternalLink } from "react-icons/fi";

// Define the type for the items
interface Item {
  eventId: number;
  title: string;
  date: string;
  start: string;
  end: string;
}

const itemsPerPage = 10;

const data: Item[] = Array.from({ length: 85 }, (_, i) => ({
  eventId: i + 1,
  title: `Lorem Ipsum Dolor Sit Amet ${i + 1}`,
  date: `01/01/2016`,
  start: `08:00`,
  end: `10:00`,
}));

export default function MentorListAttendance() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const router = useRouter();

  const filteredData = useMemo(
    () =>
      data.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [searchQuery],
  );

  const totalPages = useMemo(
    () => Math.ceil(filteredData.length / itemsPerPage),
    [filteredData.length],
  );

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage]);

  const handleEdit = useCallback(
    (id: number) => {
      // Misalnya kita dapat eventId dari data yang ada
      const eventId =
        data.find((item) => item.eventId === id)?.eventId ?? "default-event-id";
      router.push(`/attendance/edit/${eventId}`);
    },
    [router],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages],
  );

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <div className="flex w-full justify-between">
        <div className="flex w-full pr-1">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={(query: string) => {
              setSearchQuery(query);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="flex w-full overflow-x-auto">
        <Table className="w-full border-spacing-0 rounded-lg bg-gradient-to-r from-[#0010A4] to-[#EE1192]">
          <TableHeader>
            <TableRow>
              <TableHead className="rounded-tl-lg border-[1px] border-[#D1D4DB] font-bold text-white">
                No.
              </TableHead>
              <TableHead className="border-[1px] border-[#D1D4DB] font-bold text-white">
                Title
              </TableHead>
              <TableHead className="border-[1px] border-[#D1D4DB] font-bold text-white">
                Tanggal
              </TableHead>
              <TableHead className="border-[1px] border-[#D1D4DB] font-bold text-white">
                Mulai
              </TableHead>
              <TableHead className="border-[1px] border-[#D1D4DB] font-bold text-white">
                Selesai
              </TableHead>
              <TableHead className="rounded-tr-lg border-[1px] border-[#D1D4DB] font-bold text-white">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="border-[1px] border-[#D1D4DB] bg-white text-center">
            {currentData.map((item) => (
              <TableRow
                className="border-[1px] border-[#D1D4DB]"
                key={item.eventId}
              >
                <TableCell className="border-[1px] border-[#D1D4DB]">
                  {item.eventId}
                </TableCell>
                <TableCell className="border-[1px] border-[#D1D4DB]">
                  {item.title}
                </TableCell>
                <TableCell className="border-[1px] border-[#D1D4DB]">
                  {item.date}
                </TableCell>
                <TableCell className="border-[1px] border-[#D1D4DB]">
                  {item.start}
                </TableCell>
                <TableCell className="border-[1px] border-[#D1D4DB]">
                  {item.end}
                </TableCell>
                <TableCell className="border-[1px] border-[#D1D4DB]">
                  <Button
                    onClick={() => handleEdit(item.eventId)}
                    className="h-[3px] bg-transparent bg-white hover:bg-slate-400"
                  >
                    <FiExternalLink
                      size={16}
                      className="align-items text-black"
                    />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-2">
          <p className="text-[#EE1192]">Total {data.length} items</p>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <div className="h-6 rounded-md border px-3.5">
          <p>
            <span className="text-gray-500">{itemsPerPage}</span> / page
          </p>
        </div>
      </div>
    </div>
  );
}
