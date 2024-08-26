import Image from "next/image";

interface DashboardHeaderProps {
  title: string;
}

export default function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <div className="flex items-center gap-0">
      <Image
        src={"/sidebar/wave-dashboard.svg"}
        width={150}
        height={90}
        alt="Logo Dashboard"
      />

      <div className="">
        <h1 className="dashboard-title-text text-4xl font-mogula bg-gradient-to-r from-[#0010A4] via-[#0010A4] to-[#64B1F7] bg-clip-text text-transparent">Dashboard</h1>
        <p className="text-lg text-[#1023AA]">{title}</p>
      </div>
    </div>
  );
}