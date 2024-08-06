"use client";
import React from "react";
import { MdUpload } from "react-icons/md";
import DashboardHeader from "~/app/components/DashboardHeader";
import { IoChevronBackSharp } from "react-icons/io5";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function Page() {
  const [questStaus, setQuestStatus] = React.useState<string>("Side Quest");
  return (
    <>
      <DashboardHeader title="Edit Assignment" />
      <Link href="/assignment" className="my-6 flex items-center gap-3">
        <IoChevronBackSharp className="cursor-pointer text-2xl text-[#0010A4]" />
        <h1 className="w-fit bg-gradient-to-r from-[#0010A4] to-[#EE1192] bg-clip-text text-3xl font-bold text-transparent">
          Edit Tugas
        </h1>
      </Link>
      <div className="flex w-full flex-col items-center justify-start">
        <form
          action=""
          className="flex max-h-screen w-full flex-col gap-4 overflow-y-auto px-28"
        >
          <div className="flex flex-col">
            <label className="text-[#0010A4]">
              Judul Tugas<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Masukkan judul tugas nama di sini..."
              className="rounded-lg border-2 border-gray-300 px-6 py-3"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[#0010A4]">
              Deskripsi Tugas<span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Masukkan deskripsi tugas nama di sini..."
              className="rounded-lg border-2 border-gray-300 px-6 py-3"
            />
          </div>
          <div className="flex gap-6">
            <div className="w-1/2">
              <div className="flex flex-col">
                <label className="text-[#0010A4]">
                  Tanggal Mulai<span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="rounded-lg border-2 border-gray-300 px-6 py-3"
                />
              </div>
            </div>
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
          </div>
          <div className="flex gap-6">
            <div className="w-1/2">
              <div className="flex flex-col">
                <label className="text-[#0010A4]">
                  Tanggal Selesai<span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
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
          <div className="flex flex-col">
            <label className="text-[#0010A4]">
              Deskripsi Tugas<span className="text-red-500">*</span>
            </label>
            <div className="flex h-[150px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#0010A4] bg-[#F5F5FF] text-[#0010A4]">
              <MdUpload className="text-4xl" />
              <p>
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer font-bold underline"
                >
                  Click to upload{" "}
                </label>
                or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                Supported formates: JPEG, PNG, PDF, DOCSX
              </p>
              <p className="text-xs text-gray-500">Maximum file size 20 MB</p>
            </div>
            <input id="file-upload" type="file" className="hidden" />
          </div>
          {questStaus === "Side Quest" ? (
            <div className="flex flex-col">
              <label className="text-[#0010A4]">
                Poin<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Jumlah Poin"
                className="w-1/3 rounded-lg border-2 border-gray-300 px-6 py-3"
              />
            </div>
          ) : null}
        </form>
        <div className="my-10 flex w-full justify-between px-28">
          <Button variant="destructive" className="w-[110px]">
            Batal
          </Button>
          <Button className="w-[110px] bg-[#0010A4]">Submit</Button>
        </div>
      </div>
    </>
  );
}
