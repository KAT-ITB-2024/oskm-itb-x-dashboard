import DashboardHeader from "~/app/components/DashboardHeader";
import MerchandiseNavigation from "./components/MerchandiseNavigation";
import MerchandiseList from "./components/MerchandiseList";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

interface Merchandises {
  id: string;
  name: string;
  price: number;
  image: string | null;
  stock: number;
}

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const session = await getServerAuthSession();
  const user = session?.user;

  if (user?.role.toLowerCase() !== "mamet") {
    redirect("/");
  }

  if (!session) {
    return redirect("/");
  }

  const query = searchParams?.query ?? "";
  const currentPage = Number(searchParams?.page) || 1;

  let merchandises: Merchandises[] = [];
  let meta = {
    page: currentPage,
    totalPages: 1,
    pageSize: 5,
    totalCount: 0,
  };

  try {
    const response = await api.merchandise.getAllMerchandise({
      limit: 5,
      offset: (currentPage - 1) * 5,
      search: query,
    });

    merchandises = response.res;
    meta = {
      page: currentPage,
      totalPages: Math.ceil(response.count! / 5),
      pageSize: 5,
      totalCount: response.count ?? 0,
    };
  } catch (error) {
    console.error("Failed to fetch merchandises:", error);
  }

  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader title="Merchandise" />
      <MerchandiseNavigation title="Merchandise List" />
      <MerchandiseList merchandises={merchandises} meta={meta} />
    </div>
  );
}
