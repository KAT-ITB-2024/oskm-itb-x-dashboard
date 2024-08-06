"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function MametNavigationAssigment({ title }: { title: string }) {
  const router = useRouter();
  return (
    <>
      <div className="flex w-full">
        <div
          aria-checked={title === "Assignment List"}
          className={`flex h-12 w-1/2 cursor-pointer items-center justify-center rounded-l-lg border-2 font-bold ${
            title === "Assignment List"
              ? "border-0 bg-gradient-to-r from-[#0010A4] to-[#EE1192] text-white"
              : "text-[#0010A4]"
          }`}
          onClick={() => router.push("/assignment")}
        >
          Daftar Tugas
        </div>
        <div
          aria-checked={title === "Add Assignment"}
          className={`flex h-12 w-1/2 cursor-pointer items-center justify-center rounded-r-lg border-2 font-bold ${
            title === "Add Assignment"
              ? "border-0 bg-gradient-to-r from-[#0010A4] to-[#EE1192] text-white"
              : "text-[#0010A4]"
          }`}
          onClick={() => router.push("/assignment/tambah")}
        >
          Tambah Tugas
        </div>
      </div>
    </>
  );
}
