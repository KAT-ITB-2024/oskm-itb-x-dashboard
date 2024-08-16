import Image from 'next/image';
import React from 'react';

export default function SearchNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-3/4">
      <Image
        src="/sidebar/search-not-found-1.svg"
        alt="Search Not Found"
        width={300} // Sesuaikan dengan ukuran yang Anda inginkan
        height={300} // Sesuaikan dengan ukuran yang Anda inginkan
      />
        <h1 className="mt-4 text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#0010A4] to-[#64B1F7] font-mogula">
        Pencarian Tidak Ditemukan...
        </h1>

    </div>
  );
}
