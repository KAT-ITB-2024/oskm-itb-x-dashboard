"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function MerchandiseNavigation({ title }: { title: string }) {
  const router = useRouter();
  return (
    <>
      <div className="flex w-full">
        <div
          aria-checked={title === "Merchandise List"}
          className={`flex h-12 w-1/2 translate-x-0.5 cursor-pointer items-center justify-center bg-gradient-to-r from-[#0010A4] to-[#EE1192] py-0.5 pl-0.5 font-bold ${
            title === "Merchandise List"
              ? "z-10 rounded-lg"
              : "z-0 rounded-l-lg"
          }`}
          onClick={() => router.push("/merchandise")}
        >
          <div
            className={`flex h-full w-full items-center justify-center rounded-l-lg ${
              title === "Merchandise List"
                ? "bg-transparent text-white"
                : "bg-white text-[#0010A4]"
            }`}
          >
            Edit Catalog
          </div>
        </div>
        <div
          aria-checked={title === "Merchandise Exchange"}
          className={`flex h-12 w-1/2 -translate-x-0.5 cursor-pointer items-center justify-center bg-gradient-to-r from-[#0010A4] to-[#EE1192] py-0.5 pr-0.5 font-bold ${
            title === "Merchandise Exchange"
              ? "z-10 rounded-lg"
              : "z-0 rounded-r-lg"
          }`}
          onClick={() => router.push("/merchandise/exchange")}
        >
          <div
            className={`flex h-full w-full items-center justify-center rounded-r-lg ${
              title === "Merchandise Exchange"
                ? "bg-transparent text-white"
                : "bg-white text-[#0010A4]"
            }`}
          >
            Exchange Merchandise
          </div>
        </div>
      </div>
    </>
  );
}
