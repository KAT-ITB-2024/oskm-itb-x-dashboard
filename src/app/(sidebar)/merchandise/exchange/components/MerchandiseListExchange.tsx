"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import { IoMdSearch } from "react-icons/io";
import Link from "next/link";

// MOCKUP DATA
interface MerchandiseItem {
  merchandise_id: string;
  merchandise_name: string;
  price: number;
  quantity: number;
}

interface Merchandise {
  id: number;
  order_id: string;
  nim: string;
  name: string;
  status: "Belum Diambil" | "Sudah Diambil";
  list_merchandise: MerchandiseItem[];
}

// MOCKUP DATA
const merchandises: Merchandise[] = [
  {
    id: 1,
    order_id: "PZU48120",
    nim: "18221157",
    name: "Cathleen Lauretta",
    status: "Belum Diambil",
    list_merchandise: [
      {
        merchandise_id: "M0002",
        merchandise_name: "Lanyard",
        price: 50,
        quantity: 1,
      },
    ],
  },
  {
    id: 2,
    order_id: "PZU48121",
    nim: "19623005",
    name: "Carlo Angkisan",
    status: "Sudah Diambil",
    list_merchandise: [
      {
        merchandise_id: "M0001",
        merchandise_name: "Kaos OSKM Putih",
        price: 200,
        quantity: 2,
      },
    ],
  },
];

export default function MerchandiseListExchange() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <div className="flex w-full items-center justify-between rounded-lg border-2 border-input bg-white px-6 py-3">
        <input
          type="text"
          placeholder="Cari Order ID"
          className="w-full bg-transparent outline-none"
        />
        <IoMdSearch className="text-xl text-gray-400" />
      </div>
      <Table className="border-spacing-0 rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="rounded-tl-lg">No</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>NIM Pemesan</TableHead>
            <TableHead>Nama Pemesan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="rounded-tr-lg">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {merchandises.map((merchandise) => (
            <TableRow key={merchandise.id}>
              <TableCell>{merchandise.id}</TableCell>
              <TableCell className="text-start">
                {merchandise.order_id}
              </TableCell>
              <TableCell className="text-start">{merchandise.nim}</TableCell>
              <TableCell className="text-start">{merchandise.name}</TableCell>
              <TableCell>
                <p
                  className={`rounded-xl py-1 ${merchandise.status === "Sudah Diambil" ? "border-2 border-[#18A348] bg-[#BBF7D1] text-[#18A348]" : "border-2 border-[#DC2522] bg-[#FECBCA] text-[#DC2522]"}`}
                >
                  {merchandise.status}
                </p>
              </TableCell>
              <TableCell>
                <Link
                  href={`/merchandise/exchange/${merchandise.id}`}
                  className="text-[#3678FF] underline"
                >
                  View Details
                </Link>
              </TableCell>
            </TableRow>
          ))}
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
