import DashboardHeader from "~/app/components/DashboardHeader";
import MentorListAttendance from "./components/MentorListAttendance";

// all attendance list
export default function Page() {
  return (
    <div>
      <DashboardHeader title="Attendance" />
      <MentorListAttendance />
    </div>
  );
}
