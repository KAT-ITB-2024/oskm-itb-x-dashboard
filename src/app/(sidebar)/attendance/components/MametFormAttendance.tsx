"use client";

import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  useRouter,
  useSearchParams,
  useParams,
  usePathname,
} from "next/navigation";
import { api } from "~/trpc/react";
import { format } from "date-fns";
import SearchNotFound from "./MametListAttendance/MametSearchNotFound";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Calendar } from "~/components/ui/calendar";
import { cn } from "~/lib/utils";
import { CalendarIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
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
}

interface MametFormAttendanceProps {
  event: Event | undefined;
}

export default function MametFormAttendance({
  event,
}: MametFormAttendanceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const pathname = usePathname();

  const eventId = params.id as string;
  const eventType = searchParams.get("type") ?? "Opening";

  const [title, setTitle] = useState<string>("");
  const [eventDate, setEventDate] = useState<Date | undefined>(
    event?.eventDate ?? new Date(),
  );
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  const {
    data: eventData,
    isLoading,
    error,
  } = api.event.getEvent.useQuery({ id: eventId ?? "" });
  const updateEventMutation = api.event.updateEvent.useMutation();

  useEffect(() => {
    if (eventData) {
      setTitle(`${eventType} ${eventData.day}`);
      setEventDate(new Date(eventData.eventDate));
      if (eventType === "Opening") {
        setStartTime(eventData.openingOpenPresenceTime ?? "");
        setEndTime(eventData.openingClosePresenceTime ?? "");
      } else if (eventType === "Closing") {
        setStartTime(eventData.closingOpenPresenceTime ?? "");
        setEndTime(eventData.closingClosePresenceTime ?? "");
      }
    }
  }, [eventData, eventType]);

  const formatTime = (time: string): string => {
    // Menambahkan detik jika tidak ada
    return time.length === 5 ? `${time}:00` : time;
  };

  const handleSubmit = async () => {
    toast.loading("Menyimpan perubahan...");
    try {
      const updateData = {
        id: eventId ?? "",
        eventDate: eventDate?.toISOString() ?? "",
        openingOpenPresenceTime:
          eventType === "Opening" ? formatTime(startTime) : undefined,
        closingOpenPresenceTime:
          eventType === "Closing" ? formatTime(startTime) : undefined,
        openingClosePresenceTime:
          eventType === "Opening" ? formatTime(endTime) : undefined,
        closingClosePresenceTime:
          eventType === "Closing" ? formatTime(endTime) : undefined,
      };

      await updateEventMutation.mutateAsync(updateData, {
        onSuccess: () => {
          router.push("/attendance");
          router.refresh();
        },
        onError: (error) => {
          console.error("Failed to update event:", error.message);
        },
      });

      toast.dismiss();
      toast.success("Event berhasil diubah!");
    } catch (error: unknown) {
      toast.dismiss();
      if (error instanceof Error) {
        console.error(
          "An unknown error occurred during update:",
          error.message,
        );
      } else {
        console.error("An unknown error occurred during update.");
      }
    }
  };

  const handleCancel = () => {
    if (eventData) {
      setTitle(`${eventType} ${eventData.day}`);
      setEventDate(new Date(eventData.eventDate));
      if (eventType === "Opening") {
        setStartTime(eventData.openingOpenPresenceTime ?? "");
        setEndTime(eventData.openingClosePresenceTime ?? "");
      } else if (eventType === "Closing") {
        setStartTime(eventData.closingOpenPresenceTime ?? "");
        setEndTime(eventData.closingClosePresenceTime ?? "");
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <SearchNotFound />;
  }

  const handleFilter = (eventType: "Opening" | "Closing") => {
    const params = new URLSearchParams(searchParams);

    params.set("type", eventType);

    router.replace(`${pathname}?${params.toString()}`);
    router.refresh();
  };

  return (
    <div className="flex w-full flex-col items-center justify-start">
      <form className="flex max-h-screen w-full flex-col gap-4 overflow-y-auto px-28">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="max-w-48 self-end">
            <Button variant={"outline"} className="flex h-12 w-full ">
              {eventType}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuRadioGroup
              value={eventType}
              onValueChange={(value) => {
                handleFilter(value as "Opening" | "Closing");
              }}
            >
              <DropdownMenuRadioItem value="Opening">
                Opening
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Closing">
                Closing
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex flex-col">
          <label className="text-[#0010A4]">
            Judul Event<span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Masukkan judul event di sini..."
            value={event?.day}
            onChange={(e) => setTitle(e.target.value)}
            className="min-h-12 rounded-lg border-2 border-gray-300 px-6 py-3"
            disabled
          />
        </div>
        <div className="w-full">
          <div className="flex flex-col">
            <label className="text-[#0010A4]">
              Tanggal <span className="text-red-500">*</span>
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "flex justify-start rounded-lg border-2 border-gray-300 px-6 py-6",
                    !eventDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {eventDate ? (
                    format(eventDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={eventDate}
                  onSelect={(date) =>
                    setEventDate(
                      new Date(
                        (date?.getTime() ?? new Date().getTime()) +
                          7 * 60 * 60 * 1000,
                      ),
                    )
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="w-1/2">
            <div className="flex flex-col">
              <label className="text-[#0010A4]">
                Waktu Mulai<span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="rounded-lg border-2 border-gray-300 px-6 py-3"
              />
            </div>
          </div>
          <div className="w-1/2">
            <div className="flex flex-col">
              <label className="text-[#0010A4]">
                Waktu Selesai<span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="rounded-lg border-2 border-gray-300 px-6 py-3"
              />
            </div>
          </div>
        </div>
      </form>
      <div className="my-10 flex w-full justify-between px-28 py-20">
        <Button
          variant="destructive"
          className="w-[110px]"
          onClick={handleCancel}
        >
          Batal
        </Button>
        <Button className="w-[110px] bg-[#0010A4]" onClick={handleSubmit}>
          Simpan
        </Button>
      </div>
    </div>
  );
}
