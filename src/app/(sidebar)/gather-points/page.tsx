import DashboardHeader from "~/app/components/DashboardHeader";
import PointList from "./components/PointList";

export default function Page() {
  return (
    <div>
      <DashboardHeader title="Gather Points" />

      <PointList />
    </div>
  );
}
