import Image from "next/image";
import Sidebar from "../components/Sidebar";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-between gap-12 h-screen bg-[url('/sidebar/bg-dashboard.svg')] bg-cover bg-no-repeat px-10 py-12 overflow-hidden">
      <Sidebar />
      <div className="relative flex-1 h-full rounded-lg bg-white p-8">
        <Image
          src={"/sidebar/coral-dashboard.svg"}
          width={150}
          height={70}
          alt="Coral Atas"
          className="absolute -right-10 -top-8"
        />
        <Image
          src={"/sidebar/coral-bawah-dashboard.svg"}
          width={192}
          height={90}
          alt="Coral Atas"
          className="absolute -bottom-6 -left-20 z-10"
        />
        {children}
      </div>
    </div>
  );
}
