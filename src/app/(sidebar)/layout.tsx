import Image from "next/image";
import Sidebar from "../components/Sidebar";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  const user = session?.user;

  if (!user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen justify-between gap-12 overflow-hidden bg-[url('/sidebar/bg-dashboard.svg')] bg-cover bg-no-repeat px-10 py-12">
      <Sidebar />
      <div className="relative h-full min-h-[87vh] flex-1 rounded-lg bg-white p-8">
        <Image
          src={"/sidebar/coral-dashboard.svg"}
          width={150}
          height={70}
          alt="Coral Atas"
          className="absolute -right-10 -top-8"
        />
        <Image
          src={"/sidebar/coral-bawah-dashboard.svg"}
          width={192}
          height={90}
          alt="Coral Atas"
          className="absolute -bottom-6 -left-20"
        />
        {children}
      </div>
    </div>
  );
}
