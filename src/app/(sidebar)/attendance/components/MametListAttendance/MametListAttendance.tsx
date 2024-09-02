"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import Link from "next/link";
import Search from "../Search";
import { useSearchParams } from "next/navigation";
import { MdDownload } from "react-icons/md";
import { RiPencilFill } from "react-icons/ri";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";

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

export default function MametListAttendance({ events }: { events: Event[] }) {
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);
  const [currentEventId, setCurrentEventId] = useState<string>("");
  const [downloading, setDownloading] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") ?? "";

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredEvents(events);
      return;
    }

    const filtered = events.filter((event) =>
      event.day.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    setFilteredEvents(filtered);
  }, [events, searchQuery]);

  const handleDownload = async (eventId: string) => {
    toast.loading("Mendownload file CSV...");

    await csvQuery.refetch();

    toast.dismiss();

    if (csvQuery.isSuccess) {
      const csvContent = csvQuery.data.data?.content;
      const filename = csvQuery.data.data?.filename;

      const blob = new Blob([csvContent!], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename!;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      toast.success("Berhasil mendownload file CSV");
    }
  };

  const csvQuery = api.presence.getPresenceOfAnEventCSV.useQuery(
    {
      eventId: currentEventId,
    },
    {
      enabled: false,
    },
  );

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <Search placeholder="Cari Event..." />

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
          {filteredEvents.map((event, idx) => (
            <TableRow key={event.id}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{event.day}</TableCell>
              <TableCell>
                {event.eventDate.toLocaleDateString("id-ID")}
              </TableCell>
              <TableCell>{event.openingOpenPresenceTime}</TableCell>
              <TableCell>{event.closingOpenPresenceTime}</TableCell>
              <TableCell className="flex items-center justify-around">
                <Link href={`/attendance/edit/${event.id}`}>
                  <RiPencilFill size={18} className="text-[#0010A4]" />
                </Link>

                <MdDownload
                  size={20}
                  className="text-[#3678FF] hover:cursor-pointer"
                  onClick={async () => {
                    setCurrentEventId(event.id);
                    await handleDownload(event.id);
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
