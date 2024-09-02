import React from "react";
import Image from "next/image";
import { IoMdSearch } from "react-icons/io";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

// Anggap udah dimasukin be

const penilaianSubmisi = [
  {
    no: 1,
    name: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
    nim: 19624999,
    interval: "HH:MM:SS",
    status: "00:00 WIB",
    nilai: "100",
    linksubmisi: "#",
  },
  {
    no: 1,
    name: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
    nim: 19624999,
    interval: "HH:MM:SS",
    status: "00:00 WIB",
    nilai: "100",
    linksubmisi: "#",
  },
  {
    no: 1,
    name: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
    nim: 19624999,
    interval: "HH:MM:SS",
    status: "00:00 WIB",
    nilai: "100",
    linksubmisi: "#",
  },
];

const MentorSubmisiPeserta = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <Image
          className=""
          src={"/in-page/arrow_back_ios.svg"}
          width={24}
          height={24}
          alt="arrow_back"
        />
        <h1 className="ml-4 bg-gradient-to-r from-[#0010A4] to-[#EE1192] bg-clip-text text-[32px] font-bold text-transparent">
          Tugas Lorem
        </h1>
      </div>

      <div className="mt-6 flex h-[48px] w-full items-start justify-between rounded-lg border-2 border-input bg-white px-4 py-3">
        <input
          type="text"
          placeholder="Cari Tugas"
          className="w-full bg-transparent outline-none"
        />
        <IoMdSearch className="text-xl text-gray-400" />
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <div className="mt-5 w-full">
          <Table className="border-spacing-0 rounded-lg bg-gradient-to-r from-[#0010A4] to-[#EE1192]">
            <TableHeader className="h-[56px]">
              <TableRow>
                <TableHead
                  style={{ width: "5%" }}
                  className="border-2 border-gray-300 text-center font-bold text-white"
                >
                  No
                </TableHead>
                <TableHead
                  style={{ width: "25%" }}
                  className="border-2 border-gray-300 text-center font-bold text-white"
                >
                  Nama
                </TableHead>
                <TableHead
                  style={{ width: "10%" }}
                  className="border-2 border-gray-300 text-center font-bold text-white"
                >
                  NIM
                </TableHead>
                <TableHead
                  style={{ width: "25%" }}
                  className="border-2 border-gray-300 text-center font-bold text-white"
                >
                  Interval Keterlambatan
                </TableHead>
                <TableHead
                  style={{ width: "15%" }}
                  className="border-2 border-gray-300 text-center font-bold text-white"
                >
                  Status
                </TableHead>
                <TableHead
                  style={{ width: "10%" }}
                  className="border-2 border-gray-300 text-center font-bold text-white"
                >
                  Nilai
                </TableHead>
                <TableHead
                  style={{ width: "10%" }}
                  className="border-2 border-gray-300 text-center font-bold text-white"
                >
                  Open
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {penilaianSubmisi.map((item, index) => (
                <TableRow
                  key={item.no}
                  className="border-2 border-gray-500 text-[16px]"
                >
                  <TableCell className="border-2 border-gray-300 text-center">
                    {index + 1}
                  </TableCell>
                  <TableCell className="border-2 border-gray-300">
                    {item.name}
                  </TableCell>
                  <TableCell className="border-2 border-gray-300 text-center">
                    {item.nim}
                  </TableCell>
                  <TableCell className="border-2 border-gray-300 text-center">
                    {item.interval}
                  </TableCell>
                  <TableCell className="border-2 border-gray-300 text-center">
                    {item.status}
                  </TableCell>
                  <TableCell className="border-2 border-gray-300 text-center">
                    {item.nilai}
                  </TableCell>
                  <TableCell className="border-2 border-gray-300">
                    <a
                      href={item.linksubmisi}
                      className="flex items-center justify-center"
                    >
                      <Image
                        className="flex items-center justify-center"
                        src={"/in-page/openlink.svg"}
                        width={24}
                        height={24}
                        alt="open link icon"
                      />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <nav className="gap-3items-center mt-10 flex flex-row justify-center gap-4">
        <p>Total 85 Items</p>
        <ul className="flex h-6 items-center gap-3 -space-x-px text-base">
          <li>
            <a
              href="#"
              className="flex h-6 items-center justify-center rounded-md bg-[#EE1192] px-2 text-white"
            >
              <span className="sr-only">Previous</span>
              <svg
                className="h-2 w-2 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex h-6 items-center justify-center rounded-md bg-[#EE1192] px-2 text-white"
            >
              1
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex h-6 items-center justify-center rounded-md bg-[#EE1192] px-2 text-white"
            >
              2
            </a>
          </li>
          <li>
            <a
              href="#"
              aria-current="page"
              className="z-10 flex h-6 items-center justify-center rounded-md bg-[#EE1192] px-2 text-white"
            >
              3
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex h-6 items-center justify-center rounded-md bg-[#EE1192] px-2 text-white"
            >
              4
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex h-6 items-center justify-center rounded-md bg-[#EE1192] px-2 text-white"
            >
              5
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex h-6 items-center justify-center rounded-md bg-[#EE1192] px-2 text-white"
            >
              <span className="sr-only">Next</span>
              <svg
                className="h-2 w-2 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
            </a>
          </li>
        </ul>
        <div className="h-6 rounded-md border px-3.5">
          <p>
            <span className="text-gray-500">20</span> / page
          </p>
        </div>
      </nav>
    </div>
  );
};

export default MentorSubmisiPeserta;
