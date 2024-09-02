"use client";

import { Check, ChevronsUpDown, ListFilter } from "lucide-react";
import React, { useEffect, useState } from "react";
import DashboardHeader from "~/app/components/DashboardHeader";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import Pagination from "./Pagination";
import Search from "./Search";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface GroupInformationMametProps {
  groupInformations: {
    groups: {
      namaKeluarga: string | null;
      jumlahMentee: number;
    }[];
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
  meta: {
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  metaMamet: {
    page: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
  };
}

function MametPage({
  groupInformations,
  meta,
  metaMamet,
}: GroupInformationMametProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [keluarga, setKeluarga] = useState<
    { label: string; value: string }[] | undefined
  >(
    groupInformations?.groups
      .filter((g) => g.namaKeluarga !== null)
      .map((g) => ({
        label: g.namaKeluarga ?? "",
        value: g.namaKeluarga ?? "",
      })),
  );

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const groupName = searchParams.get("group")?.toString() ?? null;
  const sortBy = searchParams.get("sort") as "nim" | "nama" | null;

  const [selectedKeluarga, setSelectedKeluarga] = useState<string | null>(
    groupName,
  );
  const [selectedSort, setSelectedSort] = useState<string>(sortBy ?? "");

  const handleFilter = (keluarga = "", sort = "") => {
    const params = new URLSearchParams(searchParams);

    params.set("page", "1");

    if (keluarga !== "") {
      params.set("group", keluarga);
    }

    if (keluarga !== "" && selectedKeluarga === keluarga) {
      params.delete("group");
      setSelectedKeluarga(null);
    }

    if (sort !== "") {
      params.set("sort", sort);
    }

    router.replace(`${pathname}?${params.toString()}`);
    router.refresh();
  };

  useEffect(() => {
    if (groupName === null) {
      setKeluarga(
        groupInformations?.groups
          .filter((g) => g.namaKeluarga !== null)
          .map((g) => ({
            label: g.namaKeluarga ?? "",
            value: g.namaKeluarga ?? "",
          })),
      );
    }
  }, [groupInformations?.groups, groupName]);

  return (
    <>
      <DashboardHeader title="Group Information" />

      <div className="flex w-full flex-col items-center justify-center gap-4">
        <div className="flex w-full items-center gap-4">
          <Search placeholder="Cari Mentee..." />

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="flex h-12 w-[226px] justify-between"
              >
                {selectedKeluarga
                  ? keluarga?.find((k) => k.value === selectedKeluarga)?.label
                  : (groupName ?? "Cari Keluarga")}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[226px] p-0">
              <Command>
                <CommandInput placeholder="Cari Keluarga..." />
                <CommandList>
                  <CommandGroup>
                    {keluarga?.map((k) => (
                      <CommandItem
                        key={k.value}
                        value={k.value}
                        onSelect={(currentValue) => {
                          setSelectedKeluarga(
                            currentValue === selectedKeluarga
                              ? ""
                              : currentValue,
                          );
                          setOpen(false);
                          handleFilter(currentValue);
                        }}
                        className="data-[disabled]:opacity-100"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedKeluarga === k.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {k.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild className="max-w-48">
              <Button
                variant={"outline"}
                className="flex h-12 w-full text-gray-400 hover:text-gray-400"
              >
                {selectedSort === "" ? (
                  <>
                    {sortBy !== null ? (
                      <p className="text-black">
                        {sortBy === "nim" ? "NIM" : "Nama"}
                      </p>
                    ) : (
                      <p className="text-black">Urut berdasarkan..</p>
                    )}{" "}
                    <span className="pl-4">
                      <ListFilter size={16} />
                    </span>
                  </>
                ) : (
                  <>
                    <p className="text-black">
                      {selectedSort === "nim" ? "NIM" : "Nama"}
                    </p>{" "}
                    <span className="pl-4">
                      <ListFilter size={16} />
                    </span>
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuRadioGroup
                value={(selectedSort || sortBy) ?? ""}
                onValueChange={(value) => {
                  setSelectedSort(value);
                  handleFilter("", value);
                }}
              >
                <DropdownMenuRadioItem value="nim">NIM</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="nama">Nama</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Table className="border-spacing-0 rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="rounded-tl-lg">No</TableHead>
              <TableHead>NIM</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Fakultas</TableHead>
              <TableHead>Jumlah Tugas</TableHead>
              <TableHead className="rounded-tr-lg">Kehadiran</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupInformations?.mentees.map((item, index) => (
              <TableRow key={item.nim}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.nim}</TableCell>
                <TableCell>{item.nama}</TableCell>
                <TableCell>{item.fakultas}</TableCell>
                <TableCell
                  className={cn(
                    Math.floor(
                      (item.tugasDikumpulkan / meta.totalCount) * 100,
                    ) <= 100 && "text-[#18A348]",
                    Math.floor(
                      (item.tugasDikumpulkan / meta.totalCount) * 100,
                    ) <= 70 && "text-[#D8760A]",
                    Math.floor(
                      (item.tugasDikumpulkan / meta.totalCount) * 100,
                    ) <= 30 && "text-[#DC2522]",
                  )}
                >
                  {item.tugasDikumpulkan}/{meta.totalCount}
                </TableCell>
                <TableCell
                  className={cn(
                    Math.floor((item.kehadiran / 8) * 100) <= 100 &&
                      "text-[#18A348]",
                    Math.floor((item.kehadiran / 8) * 100) <= 70 &&
                      "text-[#D8760A]",
                    Math.floor((item.kehadiran / 8) * 100) <= 30 &&
                      "text-[#DC2522]",
                  )}
                >
                  {Math.floor((item.kehadiran / 8) * 100)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Pagination meta={metaMamet} />
      </div>
    </>
  );
}

export default MametPage;
