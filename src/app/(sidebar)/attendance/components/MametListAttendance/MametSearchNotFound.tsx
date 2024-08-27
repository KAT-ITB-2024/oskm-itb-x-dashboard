import Image from "next/image";
import React from "react";

export default function SearchNotFound() {
  return (
    <div className="flex h-3/4 flex-col items-center justify-center">
      <Image
        src="/sidebar/search-not-found-1.svg"
        alt="Search Not Found"
        width={300} // Sesuaikan dengan ukuran yang Anda inginkan
        height={300} // Sesuaikan dengan ukuran yang Anda inginkan
      />
      <h1 className="mt-4 bg-gradient-to-r from-[#0010A4] to-[#64B1F7] bg-clip-text text-center font-mogula text-4xl font-bold text-transparent">
        Pencarian Tidak Ditemukan...
      </h1>
    </div>
  );
}
