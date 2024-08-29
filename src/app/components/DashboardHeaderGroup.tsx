import Image from "next/image";

interface DashboardHeaderGroupProps {
  title: string;
  group: string;
}

export default function DashboardHeaderGroup({
  title,
  group,
}: DashboardHeaderGroupProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex w-full items-center">
        <Image
          src={"/sidebar/wave-dashboard.svg"}
          width={150}
          height={90}
          alt="Logo Dashboard"
        />

        <div>
          <h1 className="dashboard-title-text bg-gradient-to-r from-[#0010A4] via-[#0010A4] to-[#64B1F7] bg-clip-text font-mogula text-4xl text-transparent">
            Dashboard
          </h1>
          <p className="text-lg text-[#1023AA]">{title}</p>
        </div>
      </div>

      <div className="relative z-10 mr-24 flex h-[53px] w-[200px] items-center justify-center">
        <Image
          src="/img/group.png"
          alt="Group"
          width={200}
          height={53}
          className="absolute h-full w-full"
        />
        <p className="relative font-mogula text-xl text-[#99E0FF]">{group}</p>
      </div>
    </div>
  );
}
