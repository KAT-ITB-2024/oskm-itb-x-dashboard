import DashboardHeader from "~/app/components/DashboardHeader";
import MerchandiseNavigation from "./components/MerchandiseNavigation";
import MerchandiseList from "./components/MerchandiseList";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader title="Merchandise" />
      <MerchandiseNavigation title="Merchandise List" />
      <MerchandiseList />
    </div>
  );
}
