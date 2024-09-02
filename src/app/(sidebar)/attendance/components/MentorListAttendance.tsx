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
import { FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Search from "./Search";

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

export default function MentorListAttendance({ events }: { events: Event[] }) {
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);

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
    </div>
  );
}
