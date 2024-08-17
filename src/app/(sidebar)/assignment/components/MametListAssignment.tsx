import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import { IoMdSearch } from "react-icons/io";
import { RiPencilFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { MdDownload } from "react-icons/md";
import Link from "next/link";

export default function MametListAssignment() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <div className="flex w-full items-center justify-between rounded-lg border-2 border-input bg-white px-6 py-3">
        <input
          type="text"
          placeholder="Cari Tugas"
          className="w-full bg-transparent outline-none"
        />
        <IoMdSearch className="text-xl text-gray-400" />
      </div>
      <Table className="border-spacing-0 rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="rounded-tl-lg">No</TableHead>
            <TableHead>Judul Tugas</TableHead>
            <TableHead>Waktu Mulai</TableHead>
            <TableHead>Waktu Selesai</TableHead>
            <TableHead className="rounded-tr-lg">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>Lorem Ipsum Dolor Sit Amet</TableCell>
            <TableCell>DD:MM:YYYY 00:00 WIB</TableCell>
            <TableCell>DD:MM:YYYY 00:00 WIB</TableCell>
            <TableCell>
              <div className="flex items-center justify-center gap-2 text-2xl">
                <Link href="/assignment/edit/id">
                  <RiPencilFill className="text-[#0010A4]" />
                </Link>
                <Link href="">
                  <MdDelete className="text-[#DC2522]" />
                </Link>
                <Link href="">
                  <MdDownload className="text-[#3678FF]" />
                </Link>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <nav className="flex flex-row gap-3">
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
        <p className="rounded-md border px-3.5 text-center">
          <span className="text-gray-500">20</span> / page
        </p>
      </nav>
    </div>
  );
}
