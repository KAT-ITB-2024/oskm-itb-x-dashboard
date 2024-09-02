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
import Pagination from "./paginationTable";
import SearchBar from "./searchBarTable";
import { FiExternalLink } from "react-icons/fi";
import Link from "next/link";

// Define the type for the items
interface Item {
  eventId: number;
  title: string;
  date: string;
  start: string;
  end: string;
}

interface Event {
  id: string;
  day: string;
  eventDate: Date;
  openingOpenPresenceTime: string;
  closingOpenPresenceTime: string;
  openingClosePresenceTime: string;
  closingClosePresenceTime: string;
  createdAt: Date;
  updatedAt: Date;
  lore: string;
  characterName: string;
  guideBook: string;
  youtubeVideo: string;
}

const itemsPerPage = 10;

const data: Item[] = Array.from({ length: 85 }, (_, i) => ({
  eventId: i + 1,
  title: `Lorem Ipsum Dolor Sit Amet ${i + 1}`,
  date: `01/01/2016`,
  start: `08:00`,
  end: `10:00`,
}));

export default function MentorListAttendance({ events }: { events: Event[] }) {
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

      <Table className="border-spacing-0 rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="rounded-tl-lg">No.</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Mulai</TableHead>
            <TableHead>Selesai</TableHead>
            <TableHead className="rounded-tr-lg">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* {currentData.map((item) => (
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
            ))} */}

          {events.map((event, idx) => (
            <TableRow key={event.id}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{event.day}</TableCell>
              <TableCell>
                {event.eventDate.toLocaleDateString("id-ID")}
              </TableCell>
              <TableCell>{event.openingOpenPresenceTime}</TableCell>
              <TableCell>{event.closingOpenPresenceTime}</TableCell>
              <TableCell>
                <Link
                  href={`/attendance/edit/${event.id}`}
                  className="flex justify-center"
                >
                  <FiExternalLink size={16} />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* <div className="flex items-center justify-between space-x-4">
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
      </div> */}
    </div>
  );
}
