import DashboardHeader from "~/app/components/DashboardHeader";
import MentorAttendanceEdit from "../../components/MentorAttendanceEdit";
export default function Page() {
  return (
    <div>
      <DashboardHeader title="Attendance" />
      <MentorAttendanceEdit />
    </div>
  );
}
