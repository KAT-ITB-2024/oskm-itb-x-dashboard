import React from "react";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { ComboboxDemo } from "./combobox-test";

function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      {/* Contoh pemakaian table, selain style yang diharuskan bisa dilakukan styling sesuai kebutuhan */}
      <div className="max-w-xl">
        {/* Classname pada Table harus setidaknya memiliki class border-spacing-0 dan rounded-lg*/}
        <Table className="border-spacing-0 rounded-lg bg-gradient-to-r from-[#0010A4] to-[#EE1192]">
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold text-white">No.</TableHead>
              <TableHead className="font-bold text-white">Judul</TableHead>
              <TableHead className="font-bold text-white">
                Waktu Mulai
              </TableHead>
              <TableHead className="font-bold text-white">
                Waktu Selesai
              </TableHead>
              <TableHead className="font-bold text-white">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-[#E6E7EB]">
            {/* Ini nanti pake loop/map aja buat ngerender TableRow */}
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>
                Lorem Ipsum Dolor Sit Amet lorem ipsum Dolor Sit Amet
              </TableCell>
              <TableCell>Day, 00/00/00 00.00</TableCell>
              <TableCell>Day, 00/00/00 00.00</TableCell>
              <TableCell>
                <Button variant={"pink"}>Open</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2</TableCell>
              <TableCell>
                Lorem Ipsum Dolor Sit Amet lorem ipsum Dolor Sit Amet
              </TableCell>
              <TableCell>Day, 00/00/00 00.00</TableCell>
              <TableCell>Day, 00/00/00 00.00</TableCell>
              <TableCell>
                <Button variant={"pink"}>Open</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Contoh pemakaian button, tambahkan styling sesuai kebutuhan */}
      <div className="flex flex-col items-center justify-center gap-2">
        <h1>Buttons</h1>
        <div className="flex gap-4">
          <Button variant={"pink"}>Open</Button>
          <Button variant={"pinkoutline"}>Download Guidebook</Button>
          <Button variant={"yellow"}>OceanLog</Button>
        </div>
      </div>

      {/* Contoh Combobox */}
      <div className="flex flex-col items-center justify-center gap-2">
        <ComboboxDemo />
      </div>
    </main>
  );
}

export default Page;
