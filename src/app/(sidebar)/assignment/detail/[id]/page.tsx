import React from "react";
import DashboardHeader from "~/app/components/DashboardHeader";
import MametSubmisiPeserta from "../../components/MametSubmisiPeserta";


export default function Page() {
  return (
    <div>
      <div className="flex flex-col gap-4 ">
        <DashboardHeader title="Penilaian Assignment" />
        <MametSubmisiPeserta />
      </div>
    </div>
  );
}
