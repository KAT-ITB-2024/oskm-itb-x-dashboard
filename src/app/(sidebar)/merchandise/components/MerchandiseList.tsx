"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import { RiPencilFill } from "react-icons/ri";
import { MdCheck } from "react-icons/md";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import Search from "./Search";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import Pagination from "./Pagination";

interface MerchandiseListProps {
  merchandises: {
    id: string;
    name: string;
    price: number;
    image: string | null;
    stock: number;
  }[];
  meta: {
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}
export default function MerchandiseList({
  merchandises,
  meta,
}: MerchandiseListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newQuantity, setNewQuantity] = useState<string>("");
  const router = useRouter();

  const editQuantity = api.merchandise.updateQuantity.useMutation();

  const handleSaveClick = async (id: string) => {
    const quantity = parseInt(newQuantity);

    if (quantity < 0) {
      toast.error("Quantity harus lebih besar dari 0");
      return;
    }

    try {
      await editQuantity.mutateAsync({
        id: id,
        quantity: quantity,
      });
      setEditingId(null);
      setNewQuantity("");
      router.refresh();
      toast.success("Berhasil mengubah quantity");
    } catch (error) {
      console.error("Error saving quantity:", error);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <div className="flex w-full flex-col items-center justify-center">
        <Search placeholder="Cari Merchandise..." />
      </div>
      <div className="mt-3 w-full">
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
            {merchandises.map((item, index) => (
              <TableRow key={index + 1}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="text-start">{item.id}</TableCell>
                <TableCell className="text-start">{item.name}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>
                  <Link
                    href={item.image ?? ""}
                    className="text-[#3678FF] underline"
                  >
                    Link
                  </Link>
                </TableCell>
                <TableCell className="relative">
                  {editingId === item.id ? (
                    <input
                      type="number"
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(e.target.value)}
                      min="0"
                      className="absolute left-1/2 top-1/2 w-20 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 px-2 py-1"
                    />
                  ) : (
                    item.stock
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2 text-2xl">
                    {editingId === item.id ? (
                      <button onClick={() => handleSaveClick(item.id ?? "")}>
                        <MdCheck className="hover:text-green-600" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(item.id);
                          setNewQuantity(item.stock?.toString() ?? "");
                        }}
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
      </div>
      <Pagination meta={meta} />
    </div>
  );
}
