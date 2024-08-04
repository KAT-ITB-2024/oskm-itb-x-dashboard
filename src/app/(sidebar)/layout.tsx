import Sidebar from "../components/Sidebar";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-20 px-[5%] py-12">
      <Sidebar />
      {children}
    </div>
  );
}
