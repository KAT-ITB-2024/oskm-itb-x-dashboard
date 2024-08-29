import Image from "next/image";
import { Button } from "~/components/ui/button"; // Sesuaikan dengan path ShadCN button

interface ConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
}

export default function ConfirmationModal({
  onConfirm,
  onCancel,
  onClose,
}: ConfirmationModalProps) {
  return (
    <div className="relative z-20 flex min-h-[456px] w-full max-w-[300px] flex-col items-center gap-8 rounded-bl-lg rounded-br-lg rounded-tl-lg rounded-tr-lg bg-[#0010A4] p-8 py-12">
      {/* Tombol Close */}
      <div className="absolute right-4 top-4 cursor-pointer" onClick={onClose}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-yellow-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>

      {/* Gambar */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500">
        <Image
          src="/sidebar/icon.svg"
          alt="Delete Icon"
          width={48}
          height={48}
          className="object-cover"
        />
      </div>

      {/* Judul */}
      <h3 className="text-center font-mogula text-2xl font-medium leading-tight text-yellow-400">
        Konfirmasi Penghapusan Assignment
      </h3>

      {/* Deskripsi */}
      <p className="font-REM text-center text-base font-normal leading-6 text-yellow-400">
        Apakah Anda yakin ingin menghapus assignment ini?
      </p>

      {/* Tombol Aksi */}
      <div className="mt-auto flex gap-4">
        <Button
          variant="default"
          className="bg-yellow-500 text-black"
          onClick={onCancel}
        >
          Batal
        </Button>
        <Button
          variant="default"
          className="bg-red-600 text-white"
          onClick={onConfirm}
        >
          Yakin
        </Button>
      </div>
    </div>
  );
}
