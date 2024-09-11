import DashboardHeader from "~/app/components/DashboardHeader";
import MerchandiseNavigation from "../components/MerchandiseNavigation";
import MerchandiseListExchange from "./components/MerchandiseListExchange";
import { api } from "~/trpc/server";

interface MerchandisesExchange {
  id: string;
  nim: string | null;
  name: string | null;
  status: "Taken" | "Not Taken";
}
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query ?? "";
  const currentPage = Number(searchParams?.page) || 1;

  let merchandisesExchange: MerchandisesExchange[] = [];
  let meta = {
    page: currentPage,
    totalPages: 1,
    pageSize: 5,
    totalCount: 0,
  };

  try {
    const response = await api.merchandise.getMerchandiseExchange({
      limit: 5,
      offset: (currentPage - 1) * 5,
      search: query,
    });

    merchandisesExchange = response.res;
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
    <div>
      <div className="flex flex-col gap-4">
        <DashboardHeader title="Merchandise" />
        <MerchandiseNavigation title="Merchandise Exchange" />
        <MerchandiseListExchange
          merchandisesExchange={merchandisesExchange}
          meta={meta}
        />
      </div>
    </div>
  );
}
