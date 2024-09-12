"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import ModalExchangeSuccessful from "../../components/ModalExchangeSuccessful";
import { useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

interface MerchandisesExchangeProps {
  merchandisesExchangeId: {
    orderId: string;
    nim: string | null;
    name: string | null;
    status: "Taken" | "Not Taken";
  }[];
  merchandisesExchangeIdDetails: {
    merchandiseId: string;
    merchandiseName: string | null;
    price: number | null;
    quantity: number;
  }[];
}

export default function DetailExchange({
  merchandisesExchangeId,
  merchandisesExchangeIdDetails,
}: MerchandisesExchangeProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const status = merchandisesExchangeId[0]?.status;
  const editStatus = api.merchandise.editExchangeStatus.useMutation();
  const router = useRouter();

  const handleSuccessful = async (orderId: string) => {
    setShowModal(true);
    try {
      if (status === "Not Taken") {
        await editStatus.mutateAsync({
          id: orderId,
          setDone: true,
        });
      }
      router.refresh();
    } catch (error) {
      console.error("Error change status:", error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div>
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
              <p>{merchandisesExchangeId[0]?.orderId}</p>
              <p>{merchandisesExchangeId[0]?.nim}</p>
              <p>{merchandisesExchangeId[0]?.name}</p>
            </div>
          </div>
          <Table className="border-spacing-0 rounded-lg">
            <TableHeader>
              <TableRow>
                <TableHead className="rounded-tl-lg">Merchandise ID</TableHead>
                <TableHead>Merchandise Name</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead className="rounded-tr-lg">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {merchandisesExchangeIdDetails.map((item, index) => (
                <TableRow key={index + 1}>
                  <TableCell className="text-start">
                    {item.merchandiseId}
                  </TableCell>
                  <TableCell className="text-start">
                    {item.merchandiseName}
                  </TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button
            className={`mt-8 w-full text-white ${status === "Taken" ? "cursor-not-allowed bg-gray-400" : "bg-[#18A348] hover:bg-[#28C35D]/70"}`}
            disabled={status === "Taken"}
            onClick={() =>
              handleSuccessful(merchandisesExchangeId?.[0]?.orderId ?? "")
            }
          >
            Done
          </Button>
        </div>
      </div>
      {showModal && (
        <div>
          <div className="fixed inset-0 z-40 bg-black opacity-30"></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <ModalExchangeSuccessful
              onClose={handleClose}
              order_id={merchandisesExchangeId?.[0]?.orderId ?? ""}
            />
          </div>
        </div>
      )}
    </div>
  );
}
