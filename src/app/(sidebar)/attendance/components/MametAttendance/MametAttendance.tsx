
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import MametNavigation from "./MametNavigation";
import MametPagination from "./MametPagination";
import { RiPencilFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { MdDownload } from "react-icons/md";  
import Link from "next/link";
import { useState} from "react";
import { useRouter } from "next/navigation";

interface Event {
  id: string;
  day: string;
  eventDate: string;
  openingOpenPresenceTime: string;
  openingClosePresenceTime: string;
  closingOpenPresenceTime: string;
  closingClosePresenceTime: string;
}

const mockupData: Event[] = [
  {
    id: "1",
    day: "Day 1",
    eventDate: "HH:MM",
    openingOpenPresenceTime: "09:00:00",
    openingClosePresenceTime: "10:00:00",
    closingOpenPresenceTime: "17:00:00",
    closingClosePresenceTime: "18:00:00",
  },
  {
    id: "2",
    day: "Day 2",
    eventDate: "HH:MM",
    openingOpenPresenceTime: "09:00:00",
    openingClosePresenceTime: "10:00:00",
    closingOpenPresenceTime: "17:00:00",
    closingClosePresenceTime: "18:00:00",
  },
];



export default function MametListAttendance() {
  const [events, setEvents] = useState<Event[]>(mockupData);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const router = useRouter();

  const handleDayChange = (day: string | null) => {
    setSelectedDay(day);
  };

  const handleAddEvent = () => {
    return router.push('/attendance/tambah');
  };

  const handleDownload = () => {
    // Your CSV download logic
  };

  const renderTableRows = () => {
    let rowIndex = 0;

    return events.flatMap((event) => {
      const dayNumber = event.day.split(" ")[1];
      const rows = [];

      if (selectedDay && event.day !== selectedDay) {
        return [];
      }

      if (event.openingOpenPresenceTime !== "00:00:00") {
        rowIndex += 1;
        rows.push(
          <TableRow key={`opening-${event.id}`}>
            <TableCell>{rowIndex}</TableCell>
            <TableCell>{`Opening Day ${dayNumber}`}</TableCell>
            <TableCell>{event.eventDate}</TableCell>
            <TableCell>{event.openingOpenPresenceTime}</TableCell>
            <TableCell>{event.openingClosePresenceTime}</TableCell>
            <TableCell>
              <div className="flex items-center justify-center gap-2 text-2xl">
                <Link href="/attendance/edit/id">
                  <RiPencilFill className="text-[#0010A4]" />
                </Link>
                <Link href="">
                  <MdDelete className="text-[#DC2522]" />
                </Link>
                <Link href="#" onClick={handleDownload}>
                  <MdDownload className="text-[#3678FF]" />
                </Link>
              </div>
            </TableCell>
          </TableRow>
        );
      }

      if (event.closingOpenPresenceTime !== "00:00:00") {
        rowIndex += 1;
        rows.push(
          <TableRow key={`closing-${event.id}`}>
            <TableCell>{rowIndex}</TableCell>
            <TableCell>{`Closing Day ${dayNumber}`}</TableCell>
            <TableCell>{event.eventDate}</TableCell>
            <TableCell>{event.closingOpenPresenceTime}</TableCell>
            <TableCell>{event.closingClosePresenceTime}</TableCell>
            <TableCell>
              <div className="flex items-center justify-center gap-2 text-2xl">
                <Link href="/assignment/edit/id">
                  <RiPencilFill className="text-[#0010A4]" />
                </Link>
                <Link href="">
                  <MdDelete className="text-[#DC2522]" />
                </Link>
                <Link href="#" onClick={handleDownload}>
                  <MdDownload className="text-[#3678FF]" />
                </Link>
              </div>
            </TableCell>
          </TableRow>
        );
      }

      return rows;
    });
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <MametNavigation
        onSelectDay={handleDayChange}
        onAddEvent={handleAddEvent}
        onDownload={handleDownload}
      />
      <Table className="border-spacing-0 rounded-lg">
          <TableHeader>
          <TableRow >
            <TableHead className="rounded-tl-lg">No</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Waktu Mulai</TableHead>
            <TableHead>Waktu Selesai</TableHead>
            <TableHead className="rounded-tr-lg">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{renderTableRows()}</TableBody>
      </Table>
      <MametPagination/>
    </div>
  );
}

