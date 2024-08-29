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

type TAttendance = {
  nim: string;
  name: string;
  group: string;
  presence: string;
  day: string;
  openingOrClosing: string;
  attendance: {
    nim: string;
    name: string;
    group: string;
    presence: string;
  }[];
};

type TCompletePresenceResponse = {
  ok: boolean;
  message: string;
  data: TAttendance[];
};

type TPresenceOfAnEventCSVResponse = {
  ok: boolean;
  message: string;
  data: {
    filename: string;
    mimeType: string;
    content: string;
  };
};

// interface MametListAttendanceProps {}

interface DownloadParams {
  eventId: string;
  openingOrClosing: "Opening" | "Closing";
}

export default function MametListAttendance() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const { data, isLoading } = api.presence.getEventsThatHasPresence.useQuery({
    page: currentPage,
    dataPerPage: itemsPerPage,
  }); 

  const events = data?.paginatedData ?? [];
  const totalItems = data?.totalItems ?? 0;

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [downloadParams, setDownloadParams] = useState<DownloadParams | null>(null);

  const [downloadRecapTriggered, setDownloadRecapTriggered] = useState(false);
  const router = useRouter();

  const handleDayChange = (day: string | null) => {
    setSelectedDay(day);
  };

  const handleAddEvent = () => {
    return router.push("/attendance/tambah");
  };

  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      setShowConfirmDelete(false);
      setEventToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setEventToDelete(null);
  };

  // Query untuk download per baris recap
  // const { data: rowData, error: rowError } = api.presence.getPresenceOfAnEventCSV.useQuery(downloadParams, {
  //   enabled: !!downloadParams,
  // }) as { data: TPresenceOfAnEventCSVResponse | undefined; error: unknown };


  const { data: rowData, error: rowError } = api.presence.getPresenceOfAnEventCSV.useQuery(
    downloadParams ? downloadParams : { eventId: '', openingOrClosing: 'Opening' }, // Fallback ke default value
    {
      enabled: !!downloadParams, // Query akan dijalankan hanya jika downloadParams bukan null
    }
  );
  

  const { data: recapData, error: recapError } = api.presence.getCompletePresence.useQuery(undefined, {
    enabled: downloadRecapTriggered,
  }) as { data: TCompletePresenceResponse | undefined; error: unknown };


  useEffect(() => {
    // Handling download untuk keseluruhan recap
    if (recapData?.ok && recapData.data && downloadRecapTriggered) {
      const csvContent = convertToCSV(recapData.data);
      const link = document.createElement("a");
      link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
      link.download = "presences_recap.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadRecapTriggered(false); // Reset state setelah download
    } else if (recapError) {
      console.error("An error occurred during recap download:", recapError);
      setDownloadRecapTriggered(false);
    }
  }, [recapData, recapError, downloadRecapTriggered]);

  useEffect(() => {
    // Handling download untuk per baris recap
    if (rowData?.ok && rowData.data && downloadParams) {
      const link = document.createElement("a");
      link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(rowData.data.content);
      link.download = rowData.data.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadParams(null); // Reset state setelah download
    } else if (rowError) {
      console.error("An error occurred during row download:", rowError);
      setDownloadParams(null);
    }
  }, [rowData, rowError, downloadParams]);



  const handleDownloadRecap = () => {
    setDownloadRecapTriggered(true);
  };


  const handleDownloadEvent= (eventId: string, openingOrClosing: "Opening" | "Closing") => {
    setDownloadParams({ eventId, openingOrClosing });
  };

  const renderTableRows = () => {
    if (isLoading && events.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6}>Loading...</TableCell>
        </TableRow>
      );
    }

    let rowIndex = (currentPage - 1) * (itemsPerPage * 2);

    return events.flatMap((event) => {
      const rows = [];
      if (selectedDay && event.eventDay !== selectedDay) {
        return [];
      }
      const eventDate: Date =
        event.eventDate instanceof Date
          ? event.eventDate
          : new Date(event.eventDate);
      const formattedDate = format(eventDate, "dd/MM/yyyy");

      if (event.openingOpenPresenceTime !== "00:00:00") {
        rowIndex += 1;
        rows.push(
          <TableRow
            key={`opening-${event.eventId}`}
            className="border-b border-gray-200 bg-white"
          >
            <TableCell className="border-l border-r border-gray-200">
              {rowIndex}
            </TableCell>
            <TableCell className="border-r border-gray-200">{`Opening ${event.eventDay}`}</TableCell>
            <TableCell className="border-r border-gray-200">
              {formattedDate}
            </TableCell>
            <TableCell className="border-r border-gray-200">
              {event.openingOpenPresenceTime}
            </TableCell>
            <TableCell className="border-r border-gray-200">
              {event.openingClosePresenceTime}
            </TableCell>
            <TableCell className="flex items-center justify-center gap-2 border-r border-gray-200 text-2xl">
              <Link href={`/attendance/edit/opening-${event.eventId}`}>
                <RiPencilFill className="text-[#0010A4]" />
              </Link>
              <Button
                className="bg-transparent text-2xl"
                onClick={() => handleDeleteClick(event)}
              >
                <MdDelete className="text-[#DC2522]" />
              </Button>
              <Button
                className="bg-transparent text-2xl"
                onClick={() => handleDownloadEvent(event.eventId, "Opening")}
              >
                <MdDownload className="text-[#3678FF]" />
              </Button>
            </TableCell>
          </TableRow>,
        );
      }

      // Render row for Closing event
      if (event.closingOpenPresenceTime !== "00:00:00") {
        rowIndex += 1;
        rows.push(
          <TableRow
            key={`closing-${event.eventId}`}
            className="border-b border-gray-200 bg-white"
          >
            <TableCell className="border-l border-r border-gray-200">
              {rowIndex}
            </TableCell>
            <TableCell className="border-r border-gray-200">{`Closing ${event.eventDay}`}</TableCell>
            <TableCell className="border-r border-gray-200">
              {formattedDate}
            </TableCell>
            <TableCell className="border-r border-gray-200">
              {event.closingOpenPresenceTime}
            </TableCell>
            <TableCell className="border-r border-gray-200">
              {event.closingClosePresenceTime}
            </TableCell>
            <TableCell className="flex items-center justify-center gap-2 border-r border-gray-200 text-2xl">
              <Link href={`/attendance/edit/closing-${event.eventId}`}>
                <RiPencilFill className="text-[#0010A4]" />
              </Link>
              <Button
                className="bg-transparent text-2xl"
                onClick={() => handleDeleteClick(event)}
              >
                <MdDelete className="text-[#DC2522]" />
              </Button>
              <Button
                className="bg-transparent text-2xl"
                onClick={() => handleDownloadEvent(event.eventId, "Closing")}
              >
                <MdDownload className="text-[#3678FF]" />
              </Button>
            </TableCell>
          </TableRow>,
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
        onDownload ={handleDownloadRecap}
      />
      <Table className="border-spacing-0 rounded-lg text-center">
        <TableHeader className="bg-gradient-to-r from-[#0010A4] to-[#EE1192]">
          <TableRow>
            <TableHead className="rounded-tl-lg border-r border-white text-white">
              No
            </TableHead>
            <TableHead className="border-b border-r border-white text-white">
              Event
            </TableHead>
            <TableHead className="border-b border-r border-white text-white">
              Tanggal
            </TableHead>
            <TableHead className="border-b border-r border-white text-white">
              Mulai
            </TableHead>
            <TableHead className="border-b border-r border-white text-white">
              Selesai
            </TableHead>
            <TableHead className="rounded-tr-lg border-b border-white text-white">
              Action
            </TableHead>
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

function convertToCSV(data: TAttendance[]): string {
  const headers = ["NIM", "Nama", "Kelompok", "Kehadiran", "Day", "Keterangan"];
  const rows: string[] = [];

  data.forEach((event) => {
    event.attendance.forEach((attendance) => {
      rows.push([
        attendance.nim,
        attendance.name,
        attendance.group,
        attendance.presence,
        event.day,
        event.openingOrClosing,
      ].join(","));
    });
  });

  return [
    headers.join(","), // Header row
    ...rows // Data rows
  ].join("\n");
}
