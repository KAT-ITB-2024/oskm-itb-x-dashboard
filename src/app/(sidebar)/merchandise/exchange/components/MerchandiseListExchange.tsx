"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import Link from "next/link";
import Search from "../../components/Search";
import Pagination from "../../components/Pagination";

interface MerchandiseExchangeListProps {
  merchandisesExchange: {
    id: string;
    nim: string | null;
    name: string | null;
    status: "Taken" | "Not Taken";
  }[];
  meta: {
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export default function MerchandiseListExchange({
  merchandisesExchange,
  meta,
}: MerchandiseExchangeListProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <div className="flex w-full flex-col items-center justify-center">
        <Search placeholder="Cari Order ID" />
      </div>

      <div className="mt-3 w-full">
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
            {merchandisesExchange.map((item, index) => (
              <TableRow key={index + 1}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="text-start">{item.id}</TableCell>
                <TableCell className="text-start">{item.nim}</TableCell>
                <TableCell className="text-start">{item.name}</TableCell>
                <TableCell>
                  <p
                    className={`rounded-xl py-1 ${item.status === "Taken" ? "border-2 border-[#18A348] bg-[#BBF7D1] text-[#18A348]" : "border-2 border-[#DC2522] bg-[#FECBCA] text-[#DC2522]"}`}
                  >
                    {item.status === "Taken"
                      ? "Sudah Diambil"
                      : "Belum Diambil"}
                  </p>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/merchandise/exchange/${item.id}`}
                    className="text-[#3678FF] underline"
                  >
                    View Details
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination meta={meta} />
    </div>
  );
}
