"use client";

import { useState, useEffect } from "react";
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
} from "~/components/ui/table";
import MametNavigation from "./MametNavigation";
import MametPagination from "./MametPagination";
import { RiPencilFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { MdDownload } from "react-icons/md";
import { api } from "~/trpc/react";
import { format } from "date-fns";

interface Event {
  eventId: string;
  eventDay: "Day 1" | "Day 2" | "Day 3" | "Day 4";
  eventDate: Date;
  openingOpenPresenceTime: string | null;
  openingClosePresenceTime: string | null;
  closingOpenPresenceTime: string | null;
  closingClosePresenceTime: string | null;
}

export default function MametListAttendance() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1; 

  const { data, isLoading } = api.presence.getEventsThatHasPresence.useQuery({
    page: currentPage,
    dataPerPage: itemsPerPage,
  });

  const events = data?.paginatedData ??  [];
  const totalItems = data?.totalItems ?? 0;

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const router = useRouter();

  const handleDayChange = (day: string | null) => {
    setSelectedDay(day);
  };

  const handleAddEvent = () => {
    return router.push("/attendance/tambah");
  };

  const handleDownload = () => {
    //  CSV download logic
  };

  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      //  delete operation here 
      setShowConfirmDelete(false);
      setEventToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setEventToDelete(null);
  };

  const renderTableRows = () => {
    if (isLoading && events.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6}>Loading...</TableCell>
        </TableRow>
      );
    }

    let rowIndex = (currentPage - 1) * (itemsPerPage*2);

    return events.flatMap((event) => {
      const rows = [];
      if (selectedDay && event.eventDay !== selectedDay) {
        return [];
      }
      const eventDate: Date =
        event.eventDate instanceof Date ? event.eventDate : new Date(event.eventDate);
      const formattedDate = format(eventDate, "dd/MM/yyyy");

      // Render row for Opening event
      if (event.openingOpenPresenceTime !== null) {
        rowIndex += 1;
        rows.push(
          <TableRow key={`opening-${event.eventId}`} className="border-b border-gray-200 bg-white">
            <TableCell className="border-r border-l border-gray-200">{rowIndex}</TableCell>
            <TableCell className="border-r border-gray-200">{`Opening ${event.eventDay}`}</TableCell>
            <TableCell className="border-r border-gray-200">{formattedDate}</TableCell>
            <TableCell className="border-r border-gray-200">
              {event.openingOpenPresenceTime}
            </TableCell>
            <TableCell className="border-r border-gray-200">
              {event.openingClosePresenceTime}
            </TableCell>
            <TableCell className="border-r border-gray-200 flex items-center justify-center gap-2 text-2xl">
              <Link href={`/attendance/edit/opening-${event.eventId}`}>
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

      // Render row for Closing event
      if (event.closingOpenPresenceTime !== null) {
        rowIndex += 1;
        rows.push(
          <TableRow key={`closing-${event.eventId}`} className="border-b border-gray-200 bg-white">
            <TableCell className="border-l border-r border-gray-200">{rowIndex}</TableCell>
            <TableCell className="border-r border-gray-200">{`Closing ${event.eventDay}`}</TableCell>
            <TableCell className="border-r border-gray-200">{formattedDate}</TableCell>
            <TableCell className="border-r border-gray-200">
              {event.closingOpenPresenceTime}
            </TableCell>
            <TableCell className="border-r border-gray-200">
              {event.closingClosePresenceTime}
            </TableCell>
            <TableCell className="border-r border-gray-200 flex items-center justify-center gap-2 text-2xl">
              <Link href={`/attendance/edit/closing-${event.eventId}`}>
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
        <TableBody>{renderTableRows()}</TableBody>
      </Table>
      <MametPagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage} // This updates the current page
      />

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
  );
}
