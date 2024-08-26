import Image from 'next/image';
import { Button } from '~/components/ui/button'; // Sesuaikan dengan path ShadCN button

interface ConfirmDeleteEventProps {
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
}

export default function ConfirmDeleteEvent({
  onConfirm,
  onCancel,
  onClose,
}: ConfirmDeleteEventProps) {
  return (
    <div className="relative bg-[#0010A4] w-full max-w-md p-8 py-12 max-w-[300px] min-h-[456px] rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg flex flex-col items-center gap-8">
      {/* Tombol Close */}
      <div className="absolute top-4 right-4 cursor-pointer" onClick={onClose}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      {/* Gambar */}
      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
        <Image src="/sidebar/icon.svg" alt="Delete Icon" width={48} height={48} className="object-cover" />
      </div>

      {/* Judul */}
      <h3 className="text-2xl font-mogula font-medium leading-tight text-center text-yellow-400">
        Konfirmasi Penghapusan Event
      </h3>

      {/* Deskripsi */}
      <p className="text-base font-REM font-normal leading-6 text-center text-white text-yellow-400">
        Apakah Anda yakin ingin menghapus event ini?
      </p>

      {/* Tombol Aksi */}
      <div className="flex gap-4 mt-auto">
        <Button variant="default" className="bg-yellow-500 text-black" onClick={onCancel}>
          Batal
        </Button>
        <Button variant="default" className="bg-red-600 text-white" onClick={onConfirm}>
          Yakin
        </Button>
      </div>
    </div>
  );
}
