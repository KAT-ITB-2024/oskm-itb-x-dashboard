import DashboardHeader from "~/app/components/DashboardHeader";
import MerchandiseNavigation from "../components/MerchandiseNavigation";
import MerchandiseListExchange from "./components/MerchandiseListExchange";

export default function Page() {
  return (
    <div>
      <div className="flex flex-col gap-4">
        <DashboardHeader title="Merchandise" />
        <MerchandiseNavigation title="Merchandise Exchange" />
        <MerchandiseListExchange />
      </div>
    </div>
  );
}
