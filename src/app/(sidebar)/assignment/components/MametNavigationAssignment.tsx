"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function MametNavigationAssignment({
  title,
}: {
  title: string;
}) {
  const router = useRouter();
  return (
    <>
      <div className="flex w-full">
        <div
          aria-checked={title === "Assignment List"}
          className={`flex h-12 w-1/2 translate-x-0.5 cursor-pointer items-center justify-center bg-gradient-to-r from-[#0010A4] to-[#EE1192] py-0.5 pl-0.5 font-bold ${
            title === "Assignment List" ? "z-10 rounded-lg" : "z-0 rounded-l-lg"
          }`}
          onClick={() => router.push("/assignment")}
        >
          <div
            className={`flex h-full w-full items-center justify-center rounded-l-lg ${
              title === "Assignment List"
                ? "bg-transparent text-white"
                : "bg-white text-[#0010A4]"
            }`}
          >
            Daftar Tugas
          </div>
        </div>
        <div
          aria-checked={title === "Add Assignment"}
          className={`flex h-12 w-1/2 -translate-x-0.5 cursor-pointer items-center justify-center bg-gradient-to-r from-[#0010A4] to-[#EE1192] py-0.5 pr-0.5 font-bold ${
            title === "Add Assignment" ? "z-10 rounded-lg" : "z-0 rounded-r-lg"
          }`}
          onClick={() => router.push("/assignment/tambah")}
        >
          <div
            className={`flex h-full w-full items-center justify-center rounded-r-lg ${
              title === "Add Assignment"
                ? "bg-transparent text-white"
                : "bg-white text-[#0010A4]"
            }`}
          >
            Tambah Tugas
          </div>
        </div>
      </div>
    </>
  );
}
