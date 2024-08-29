"use client";

import { Check, ChevronsUpDown, ListFilter } from "lucide-react";
import React, { useState } from "react";
import { IoMdSearch } from "react-icons/io";
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

interface MenteeInformations {
  nim: string;
  name: string;
  faculty: string;
  taskCount: string;
  abscence: string;
}

const dummy = [
  {
    nim: "18221157",
    name: "Cathleen Laureta",
    faculty: "STEI-K",
    taskCount: "3/5",
    abscence: "100%",
  },
  {
    nim: "18221157",
    name: "Cathleen Laureta",
    faculty: "STEI-K",
    taskCount: "3/5",
    abscence: "100%",
  },
  {
    nim: "18221157",
    name: "Cathleen Laureta",
    faculty: "STEI-K",
    taskCount: "3/5",
    abscence: "100%",
  },
];

const keluarga = [
  {
    value: "keluarga-1",
    label: "Keluarga 1",
  },
  {
    value: "keluarga-2",
    label: "Keluarga 2",
  },
  {
    value: "keluarga-3",
    label: "Keluarga 3",
  },
  {
    value: "keluarga-4",
    label: "Keluarga 4",
  },
];

function MametPage() {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedKeluarga, setSelectedKeluarga] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<string>("");

  const [data, setData] = useState<MenteeInformations[]>(dummy);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalItems = data.length;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Fetch or update your data based on the new page number
    }
  };

  return (
    <>
      <DashboardHeader title="Group Information" />

      <div className="flex w-full flex-col items-center justify-center gap-4">
        <div className="flex w-full items-center gap-4">
          <div className="flex h-full w-full items-center justify-between rounded-lg border-2 border-input bg-white px-6 py-3">
            <input
              type="text"
              placeholder="Cari Mentee..."
              className="w-full bg-transparent outline-none"
            />
            <IoMdSearch className="text-xl text-gray-400" />
          </div>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="flex h-[52.6px] w-[226px] justify-between"
              >
                {selectedKeluarga
                  ? keluarga.find((k) => k.value === selectedKeluarga)?.label
                  : "Cari Keluarga"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[226px] p-0">
              <Command>
                <CommandInput placeholder="Cari Keluarga..." />
                <CommandList>
                  <CommandGroup>
                    {keluarga.map((k) => (
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
            <DropdownMenuTrigger>
              <Button
                variant={"outline"}
                className="flex h-[52.6px] text-gray-400 hover:text-gray-400"
              >
                Urut berdasarkan..{" "}
                <span className="pl-4">
                  <ListFilter size={16} />
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuRadioGroup
                value={selectedSort}
                onValueChange={setSelectedSort}
              >
                <DropdownMenuRadioItem value="nim">NIM</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="faculty">
                  Fakultas
                </DropdownMenuRadioItem>
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
            {dummy.map((item, index) => (
              <TableRow key={item.nim}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.nim}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.faculty}</TableCell>
                <TableCell>{item.taskCount}</TableCell>
                <TableCell>{item.abscence}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <nav className="flex flex-row items-center gap-3">
          <p className="text-[#EE1192]">Total {totalItems} Items</p>
          <ul className="flex h-6 items-center gap-3 -space-x-px text-base">
            <li>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-6 items-center justify-center rounded-md bg-[#EE1192] px-2 text-white disabled:bg-gray-400"
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="h-2 w-2 rtl:rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                  aria-hidden="true"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 1 1 5l4 4"
                  />
                </svg>
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page}>
                <button
                  onClick={() => handlePageChange(page)}
                  className={`flex h-6 items-center justify-center rounded-md px-2 ${
                    currentPage === page
                      ? "bg-[#EE1192] text-white"
                      : "border bg-white text-[#EE1192]"
                  }`}
                >
                  {page}
                </button>
              </li>
            ))}

            <li>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex h-6 items-center justify-center rounded-md bg-[#EE1192] px-2 text-white disabled:bg-gray-400"
              >
                <span className="sr-only">Next</span>
                <svg
                  className="h-2 w-2 rtl:rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                  aria-hidden="true"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
              </button>
            </li>
          </ul>
          <p className="rounded-md border px-3.5 text-center">
            <span className="text-gray-500">{itemsPerPage}</span> / page
          </p>
        </nav>
      </div>
    </>
  );
}

export default MametPage;
