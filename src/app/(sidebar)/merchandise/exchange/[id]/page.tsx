"use client";

import Link from "next/link";
import DashboardHeader from "~/app/components/DashboardHeader";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import MerchandiseNavigation from "../../components/MerchandiseNavigation";
import ModalExchangeSuccessful from "../components/ModalExchangeSuccessful";
import { useState } from "react";

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

export default function DetailMerchandise(props: { params: { id: string } }) {
  const { params } = props;
  const merchandise = merchandises.find(
    (merch) => merch.id === Number(params.id),
  );

  const [showModal, setShowModal] = useState<boolean>(false);

  const handleSuccessful = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <DashboardHeader title="Merchandise" />
        <MerchandiseNavigation title="Merchandise Exchange" />
        <div className="mx-auto mt-8 flex w-10/12 gap-4">
          <Button variant="link">
            <Link href="/merchandise/exchange">
              <svg
                className="h-7 w-7 rtl:rotate-180"
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
            </Link>
          </Button>

          <div className="flex w-full flex-col gap-3">
            <div className="flex gap-16">
              <div className="flex flex-col gap-3 font-semibold">
                <p>Order ID</p>
                <p>NIM Pemesan</p>
                <p>Nama Pemesan</p>
                <p>Detail Pesanan</p>
              </div>
              <div className="flex flex-col gap-3">
                <p>{merchandise?.order_id}</p>
                <p>{merchandise?.nim}</p>
                <p>{merchandise?.name}</p>
              </div>
            </div>
            <Table className="border-spacing-0 rounded-lg">
              <TableHeader>
                <TableRow>
                  <TableHead className="rounded-tl-lg">
                    Merchandise ID
                  </TableHead>
                  <TableHead>Merchandise Name</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead className="rounded-tr-lg">Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {merchandise?.list_merchandise.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-start">
                      {item.merchandise_id}
                    </TableCell>
                    <TableCell className="text-start">
                      {item.merchandise_name}
                    </TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              className="mt-8 w-full bg-[#18A348] text-white hover:bg-[#28C35D]/70"
              onClick={handleSuccessful}
            >
              Done
            </Button>
          </div>
        </div>
      </div>
      {showModal && (
        <ModalExchangeSuccessful
          onClose={handleClose}
          order_id={merchandise?.order_id ?? ""}
        />
      )}
    </div>
  );
}
