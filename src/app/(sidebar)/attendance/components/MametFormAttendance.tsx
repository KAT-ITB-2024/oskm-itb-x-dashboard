"use client";

import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { format } from "date-fns";
import SearchNotFound from "./MametListAttendance/MametSearchNotFound";

export default function MametFormAttendance() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const eventId = params.id as string;
  const eventType = searchParams.get("type") ?? "Opening";

  const [title, setTitle] = useState<string>("");
  const [eventDate, setEventDate] = useState<string>("");
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
      setEventDate(format(new Date(eventData.eventDate), "yyyy-MM-dd"));
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
    try {
      const updateData = {
        id: eventId ?? "",
        eventDate,
        openingOpenPresenceTime:
          eventType === "Opening" ? formatTime(startTime) : undefined,
        closingOpenPresenceTime:
          eventType === "Closing" ? formatTime(startTime) : undefined,
        openingClosePresenceTime:
          eventType === "Opening" ? formatTime(endTime) : undefined,
        closingClosePresenceTime:
          eventType === "Closing" ? formatTime(endTime) : undefined,
      };

      updateEventMutation.mutate(updateData, {
        onSuccess: () => {
          router.push("/attendance");
        },
        onError: (error) => {
          console.error("Failed to update event:", error.message);
        },
      });
    } catch (error: unknown) {
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
      setEventDate(format(new Date(eventData.eventDate), "yyyy-MM-dd"));
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

  return (
    <div className="flex w-full flex-col items-center justify-start">
      <form className="flex max-h-screen w-full flex-col gap-4 overflow-y-auto px-28">
        <div className="flex flex-col">
          <label className="text-[#0010A4]">
            Judul Event<span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Masukkan judul event di sini..."
            value={title}
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
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="rounded-lg border-2 border-gray-300 px-6 py-3"
            />
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
