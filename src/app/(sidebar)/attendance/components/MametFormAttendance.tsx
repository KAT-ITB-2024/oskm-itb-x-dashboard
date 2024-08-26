"use client";

import React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRouter } from "next/navigation";

interface FormProps {
  onSubmit: () => void;
}

export default function MametFormAttendance({onSubmit} : FormProps) {
  const router = useRouter()
  const handleCancelDelete = () => {
    return router.push('/attendance')
  
  };

  return (
    <div className="flex w-full flex-col items-center justify-start">
      <form
        action=""
        className="flex max-h-screen w-full flex-col gap-4 overflow-y-auto px-28"
      >
        <div className="flex flex-col">
          <label className="text-[#0010A4]">
            Judul Event<span className="text-red-500">*</span>
          </label>
          <Input  
            placeholder="Masukkan judul event di sini..."
            className="min-h-12 rounded-lg border-2 border-gray-300 px-6 py-3"/>
        </div>
          <div className="w-full">
            <div className="flex flex-col">
              <label className="text-[#0010A4]">
                Tanggal <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="rounded-lg border-2 border-gray-300 px-6 py-3"
              />
            </div>
        <div className="w-1/2">

          </div>
        </div>
        <div className="flex gap-6">
          <div className="w-1/2">
              <div className="flex flex-col">
                <label className="text-[#0010A4]">
                  Waktu Mulai<span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  className="rounded-lg border-2 border-gray-300 px-6 py-3"
                />
              </div>
            </div>
          <div className="w-1/2">
            <div className="flex flex-col">
              <label className="text-[#0010A4]">
                Waktu Selesai<span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                className="rounded-lg border-2 border-gray-300 px-6 py-3"
              />
            </div>
          </div>
        </div>
      </form>
      <div className="my-10 flex w-full justify-between px-28 py-20">
        <Button variant="destructive" className="w-[110px]" onClick={handleCancelDelete}>
          Batal
        </Button>
        <Button className="w-[110px] bg-[#0010A4]" onClick={onSubmit}>Submit</Button>
      </div>
    </div>
  );
}