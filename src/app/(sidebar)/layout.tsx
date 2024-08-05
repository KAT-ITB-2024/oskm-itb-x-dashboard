import Image from "next/image";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-20 bg-[url('/sidebar/bg-dashboard.svg')] bg-cover bg-no-repeat px-[5%] py-12">
      <Sidebar />
      <div className="relative min-h-screen w-full rounded-lg bg-white px-[5%] py-16">
        <Image
          src={"/sidebar/coral-dashboard.svg"}
          width={192}
          height={90}
          alt="Coral Atas"
          className="absolute -right-6 -top-10"
        />
        <Image
          src={"/sidebar/coral-bawah-dashboard.svg"}
          width={192}
          height={90}
          alt="Coral Atas"
          className="absolute -bottom-3 left-0"
        />
        {children}
      </div>
    </div>
  );
}
