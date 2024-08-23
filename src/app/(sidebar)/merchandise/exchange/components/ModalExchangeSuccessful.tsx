import { MdCheck } from "react-icons/md";
import { MdClose } from "react-icons/md";

interface ModalProps {
  onClose: () => void;
  order_id: string;
}

export default function ModalExchangeSuccessful({
  onClose,
  order_id,
}: ModalProps) {
  return (
    <div className="absolute left-[400px] top-36 z-20 flex w-80 flex-col items-center rounded-lg bg-[#0010A4] px-9 py-12">
      <MdClose
        className="absolute right-3 top-3 size-7 cursor-pointer text-[#FFE429]"
        onClick={onClose}
      />
      <MdCheck className="size-16 rounded-full bg-[#28C35D] p-2 text-[#14803E]" />
      <h1 className="mt-6 text-center font-mogula text-2xl text-[#FFE429]">
        Order ID {order_id} berhasil diselesaikan!
      </h1>
    </div>
  );
}
