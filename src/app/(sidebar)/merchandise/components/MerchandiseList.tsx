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
import { RiPencilFill } from "react-icons/ri";
import { MdCheck } from "react-icons/md";
import Link from "next/link";
import { useState } from "react";

interface Merchandise {
  id: number;
  merchandise_id: string;
  merchandise_name: string;
  price: number;
  url_image: string;
  quantity: number;
}
// MOCKUP DATA
const initialMerchandises: Merchandise[] = [
  {
    id: 1,
    merchandise_id: "M0001",
    merchandise_name: "Kaos OSKM Putih",
    price: 200,
    url_image: "",
    quantity: 2,
  },
  {
    id: 2,
    merchandise_id: "M0002",
    merchandise_name: "Lanyard",
    price: 50,
    url_image: "",
    quantity: 1,
  },
];

export default function MerchandiseList() {
  const [merchandises, setMerchandises] = useState(initialMerchandises);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number | null>(null);

  const handleEditClick = (id: number, currentQuantity: number) => {
    setEditingId(id);
    setQuantity(currentQuantity);
  };

  const handleSaveClick = (id: number) => {
    setMerchandises((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: quantity! } : item,
      ),
    );
    setEditingId(null);
    setQuantity(null);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <div className="flex w-full items-center justify-between rounded-lg border-2 border-input bg-white px-6 py-3">
        <input
          type="text"
          placeholder="Cari Merchandise"
          className="w-full bg-transparent outline-none"
        />
        <IoMdSearch className="text-xl text-gray-400" />
      </div>
      <Table className="border-spacing-0 rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="rounded-tl-lg">No</TableHead>
            <TableHead>Merchandise ID</TableHead>
            <TableHead>Merchandise Name</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Gambar</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead className="rounded-tr-lg">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {merchandises.map((merchandise) => (
            <TableRow key={merchandise.id}>
              <TableCell>{merchandise.id}</TableCell>
              <TableCell className="text-start">
                {merchandise.merchandise_id}
              </TableCell>
              <TableCell className="text-start">
                {merchandise.merchandise_name}
              </TableCell>
              <TableCell>{merchandise.price}</TableCell>
              <TableCell>
                <Link
                  href={merchandise.url_image}
                  className="text-[#3678FF] underline"
                >
                  Link
                </Link>
              </TableCell>
              <TableCell className="relative">
                {editingId === merchandise.id ? (
                  <input
                    type="number"
                    value={quantity!}
                    onChange={handleQuantityChange}
                    min="0"
                    className="absolute left-1/2 top-1/2 w-20 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 px-2 py-1"
                  />
                ) : (
                  merchandise.quantity
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2 text-2xl">
                  {editingId === merchandise.id ? (
                    <button onClick={() => handleSaveClick(merchandise.id)}>
                      <MdCheck className="hover:text-green-600" />
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        handleEditClick(merchandise.id, merchandise.quantity)
                      }
                    >
                      <RiPencilFill className="hover:text-blue-400" />
                    </button>
                  )}
                </div>
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
