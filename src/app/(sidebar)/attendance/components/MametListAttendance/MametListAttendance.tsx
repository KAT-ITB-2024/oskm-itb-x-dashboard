
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import ConfirmDeleteEvent from "./MametDeleteConfirmation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"; // Mengimpor Tabel 2
import MametNavigation from "./MametNavigation";
import MametPagination from "./MametPagination";
import { RiPencilFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { MdDownload } from "react-icons/md";

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
    eventDate: "HH:MM:YY",
    openingOpenPresenceTime: "09:00:00",
    openingClosePresenceTime: "10:00:00",
    closingOpenPresenceTime: "17:00:00",
    closingClosePresenceTime: "18:00:00",
  },
  {
    id: "2",
    day: "Day 2",
    eventDate: "HH:MM:YY",
    openingOpenPresenceTime: "09:00:00",
    openingClosePresenceTime: "10:00:00",
    closingOpenPresenceTime: "17:00:00",
    closingClosePresenceTime: "18:00:00",
  },
];

export default function MametListAttendance() {
  const [events, setEvents] = useState<Event[]>(mockupData);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
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

  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      setEvents(events.filter(e => e.id !== eventToDelete.id));
      setShowConfirmDelete(false);
      setEventToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setEventToDelete(null);
  };

  const renderTableRows = () => {
    // render rows function sample for testing
    let rowIndex = 0;

    return events.flatMap((event) => {
      const dayNumber = event.day.split(" ")[1];
      const rows = [];

      if (selectedDay && event.day !== selectedDay) {
        return [];
      }

      if (event.openingOpenPresenceTime !== "00:00:00") {  //00:00:00 assumed as default//
        rowIndex += 1;
        rows.push(
          <TableRow key={`opening-${event.id}`} className="border-b border-gray-200 bg-white">
            <TableCell className="border-r border-l border-gray-200">{rowIndex}</TableCell>
            <TableCell className="border-r border-gray-200">{`Opening Day ${dayNumber}`}</TableCell>
            <TableCell className="border-r border-gray-200">{event.eventDate}</TableCell>
            <TableCell className="border-r border-gray-200">{event.openingOpenPresenceTime}</TableCell>
            <TableCell className="border-r border-gray-200">{event.openingClosePresenceTime}</TableCell>
            <TableCell className="border-r border-gray-200 flex items-center justify-center gap-2 text-2xl">
              <Link href={`/attendance/edit/opening-${event.id}`}>
                <RiPencilFill className="text-[#0010A4]" />
              </Link>
              <Button className="bg-transparent text-2xl" onClick={() => handleDeleteClick(event)}>
                <MdDelete className="text-[#DC2522]" />
              </Button>
              <Link href="#" onClick={handleDownload}>
                <MdDownload className="text-[#3678FF]" />
              </Link>
            </TableCell>
          </TableRow>
        );
      }

      if (event.closingOpenPresenceTime !== "00:00:00") {  
        rowIndex += 1;
        rows.push(
          <TableRow  key={`closing-${event.id}`} className="border-b border-gray-200 bg-white">
            <TableCell className="border-l border-r border-gray-200">{rowIndex}</TableCell>
            <TableCell className="border-r border-gray-200">{`Closing Day ${dayNumber}`}</TableCell>
            <TableCell className="border-r border-gray-200">{event.eventDate}</TableCell>
            <TableCell className="border-r border-gray-200">{event.closingOpenPresenceTime}</TableCell>
            <TableCell className="border-r border-gray-200">{event.closingClosePresenceTime}</TableCell>
            <TableCell className="border-r border-gray-200 flex items-center justify-center gap-2 text-2xl">
              <Link href={`/attendance/edit/closing-${event.id}`}>
                <RiPencilFill className="text-[#0010A4]" />
              </Link>
              <Button className="bg-transparent text-2xl" onClick={() => handleDeleteClick(event)}>
                <MdDelete className="text-[#DC2522]" />
              </Button>
              <Link href="#" onClick={handleDownload}>
                <MdDownload className="text-[#3678FF]" />
              </Link>
            </TableCell>
          </TableRow>
        );
      }

      return rows;
    });
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <div className="py-3"></div>
      <MametNavigation
        onSelectDay={handleDayChange}
        onAddEvent={handleAddEvent}
        onDownload={handleDownload}
      />
      <Table className="border-spacing-0 rounded-lg text-center">
        <TableHeader className="bg-gradient-to-r from-[#0010A4] to-[#EE1192]">
          <TableRow>
            <TableHead className="rounded-tl-lg border-r border-white text-white">No</TableHead>
            <TableHead className="border-r border-b border-white text-white">Event</TableHead>
            <TableHead className="border-r border-b border-white text-white">Tanggal</TableHead>
            <TableHead className="border-r border-b border-white text-white">Mulai</TableHead>
            <TableHead className="border-r border-b border-white text-white">Selesai</TableHead>
            <TableHead className="rounded-tr-lg border-b border-white text-white">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* A Row Layout Example */}
        <TableRow  key={`closing-${0}`} className="border-b border-gray-200 bg-white">
            <TableCell className="border-l border-r border-gray-200">{0}</TableCell>
            <TableCell className="border-r border-gray-200">{'Contoh Layout'}</TableCell>
            <TableCell className="border-r border-gray-200">{'HH:MM:YY'}</TableCell>
            <TableCell className="border-r border-gray-200">{'23:59:59'}</TableCell>
            <TableCell className="border-r border-gray-200">{'23:59:59'}</TableCell>
            <TableCell className="border-r border-gray-200 flex items-center justify-center gap-2 text-2xl">
              <Link href={`/attendance/edit/closing-${0}`}>
                <RiPencilFill className="text-[#0010A4]" />
              </Link>
              <Button className="bg-transparent text-2xl" >
                <MdDelete className="text-[#DC2522]" />
              </Button>
              <Link href="#" onClick={handleDownload}>
                <MdDownload className="text-[#3678FF]" />
              </Link>
            </TableCell>
          </TableRow>

            {/* Rows from render table function Examples */}
          {renderTableRows()}

        </TableBody>
      </Table>
      <MametPagination />

      {showConfirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <ConfirmDeleteEvent 
            onConfirm={handleConfirmDelete} 
            onCancel={handleCancelDelete} 
            onClose={handleCancelDelete} 
          />
        </div>
      )}
    </div>
  );}