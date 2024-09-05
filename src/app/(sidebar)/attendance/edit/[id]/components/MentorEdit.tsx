"use client";

import { ChevronDown, ChevronLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DashboardHeaderGroup from "~/app/components/DashboardHeaderGroup";
import Search from "./Search";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { FaCheck } from "react-icons/fa";
import { RiPencilFill } from "react-icons/ri";
import toast from "react-hot-toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import Pagination from "./Pagination";
import { cn } from "~/lib/utils";

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

interface MentorEditProps {
  menteesData: {
    mentees: {
      nim: string | null;
      nama: string | null;
      fakultas:
        | "FITB"
        | "FMIPA"
        | "FSRD"
        | "FTMD"
        | "FTTM"
        | "FTSL"
        | "FTI"
        | "SAPPK"
        | "SBM"
        | "SF"
        | "SITH"
        | "STEI"
        | null;
      tugasDikumpulkan: number;
      kehadiran: number;
    }[];
    page: number;
    pageSize: number;
  } | null;
  metaMentor: {
    page: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
  };
  group: string | null | undefined;
  event: Event | undefined;
  presenceData:
    | {
        name: string | undefined;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        presenceType: "Hadir" | "Izin/Sakit" | "Alpha";
        presenceEvent: "Opening" | "Closing";
        userNim: string;
        eventId: string;
        remark: string | null;
      }[]
    | undefined;
}

function MentorEdit({
  menteesData,
  metaMentor,
  group,
  event,
  presenceData,
}: MentorEditProps) {
  const [data, setData] = useState(menteesData?.mentees ?? []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newKeterangan, setNewKeterangan] = useState<string>("");

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const eventType = searchParams.get("eventType") ?? "Opening";

  const updatePresenceMutation =
    api.presence.upsertGroupPresenceDataSingle.useMutation();

  useEffect(() => {
    setData(
      menteesData?.mentees.slice(
        (metaMentor.page - 1) * metaMentor.pageSize,
        metaMentor.page * metaMentor.pageSize,
      ) ?? [],
    );
  }, [menteesData, metaMentor.page, metaMentor.pageSize]);

  const handleSave = async (nim: string, presence: string) => {
    try {
      toast.loading("Menyimpan keterangan...");

      await updatePresenceMutation.mutateAsync({
        eventId: event?.id ?? "",
        presenceEvent: eventType as "Opening" | "Closing",
        userNim: nim,
        presenceType: presence as "Hadir" | "Izin/Sakit" | "Alpha",
        keterangan: newKeterangan,
      });

      toast.dismiss();
      toast.success("Berhasil menyimpan keterangan.");

      setEditingId(null);
      setNewKeterangan("");
      router.refresh();
    } catch (error) {
      console.error("Error saving points:", error);
    }
  };

  const handleChangePresence = async (nim: string, presence: string) => {
    try {
      toast.loading("Mengubah kehadiran...");

      await updatePresenceMutation.mutateAsync({
        eventId: event?.id ?? "",
        presenceEvent: eventType as "Opening" | "Closing",
        userNim: nim,
        presenceType: presence as "Hadir" | "Izin/Sakit" | "Alpha",
      });

      toast.dismiss();
      toast.success("Berhasil mengubah kehadiran.");

      router.refresh();
    } catch (error) {
      console.error("Error changing presence:", error);
    }
  };

  const handleFilter = (eventType: "Opening" | "Closing") => {
    const params = new URLSearchParams(searchParams);

    params.set("page", "1");

    params.set("eventType", eventType);

    router.replace(`${pathname}?${params.toString()}`);
    router.refresh();
  };

  const presenceType = [
    {
      value: "Hadir",
      label: "Hadir",
    },
    {
      value: "Izin/Sakit",
      label: "Izin/Sakit",
    },
    {
      value: "Alpha",
      label: "Alpha",
    },
  ];

  return (
    <>
      <DashboardHeaderGroup
        title="Group Information"
        group={group?.split("-").join(" ") ?? "Keluarga 0"}
      />

      <div className="flex w-full flex-col items-center justify-center gap-4">
        <Link href="/attendance" className="flex items-center self-start">
          <ChevronLeft className="text-[#0010A4]" size={48} />
          <p className="bg-gradient-to-r from-[#0010A4] to-[#EE1192] bg-clip-text font-rem text-3xl font-bold text-transparent">
            {event?.day}
          </p>
        </Link>

        <div className="flex w-full gap-4">
          <Search placeholder="Cari Nama..." />

          <DropdownMenu>
            <DropdownMenuTrigger asChild className="max-w-48">
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
        </div>

        <Table className="border-spacing-0 rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="rounded-tl-lg">No</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>NIM</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Keterangan</TableHead>
              <TableHead className="rounded-tr-lg">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.nim}>
                <TableCell>
                  {index + 1 + (metaMentor.page - 1) * metaMentor.pageSize}
                </TableCell>
                <TableCell>{item.nama}</TableCell>
                <TableCell>{item.nim}</TableCell>
                <TableCell>
                  {presenceData
                    ?.find((presence) => presence.userNim === item.nim)
                    ?.createdAt?.toLocaleString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }) ?? "-"}
                  ,{" "}
                  {presenceData
                    ?.find((presence) => presence.userNim === item.nim)
                    ?.createdAt?.toLocaleString("id-ID", {
                      hour: "numeric",
                      minute: "numeric",
                    }) ?? "-"}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="max-w-48">
                      <Button
                        variant={"outline"}
                        className={cn(
                          "flex w-full justify-between border-[#DC2522] text-[#DC2522] hover:text-[#DC2522]",
                          presenceData?.find(
                            (presence) => presence.userNim === item.nim,
                          )?.presenceType === "Izin/Sakit" &&
                            "border-[#F06B02] bg-[#FFD897] text-[#F06B02] hover:text-[#F06B02]",
                          presenceData?.find(
                            (presence) => presence.userNim === item.nim,
                          )?.presenceType === "Hadir" &&
                            "border-[#05A798] bg-[#C5FFF3] text-[#05A798] hover:text-[#05A798]",
                        )}
                      >
                        <span>
                          {presenceData?.find(
                            (presence) => presence.userNim === item.nim,
                          )?.presenceType ?? "Alpha"}
                        </span>
                        <span>
                          <ChevronDown size={16} />
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuRadioGroup
                        value={
                          presenceData?.find(
                            (presence) => presence.userNim === item.nim,
                          )?.presenceType ?? "Alpha"
                        }
                        onValueChange={async (value) => {
                          await handleChangePresence(item.nim ?? "", value);
                        }}
                      >
                        {presenceType.map((type) => (
                          <DropdownMenuRadioItem
                            key={type.value}
                            value={type.value}
                          >
                            {type.label}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell>
                  {editingId === item.nim ? (
                    <input
                      type="text"
                      value={newKeterangan}
                      onChange={(e) => setNewKeterangan(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 p-2 text-center"
                    />
                  ) : (
                    <p>
                      {presenceData?.find(
                        (presence) => presence.userNim === item.nim,
                      )?.remark ?? "-"}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2 text-2xl">
                    {editingId === item.nim ? (
                      <FaCheck
                        className="cursor-pointer text-[#0010A4] hover:text-[#00A86B]"
                        onClick={() =>
                          handleSave(
                            item.nim ?? "",
                            presenceData?.find(
                              (presence) => presence.userNim === item.nim,
                            )?.presenceType ?? "Alpha",
                          )
                        }
                      />
                    ) : (
                      <RiPencilFill
                        className="cursor-pointer text-[#0010A4]"
                        onClick={() => {
                          setEditingId(item.nim);
                          setNewKeterangan(
                            presenceData?.find(
                              (presence) => presence.userNim === item.nim,
                            )?.remark ?? newKeterangan,
                          );
                        }}
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Pagination meta={metaMentor} />
      </div>
    </>
  );
}

export default MentorEdit;
