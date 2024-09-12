import DashboardHeader from "~/app/components/DashboardHeader";
import MerchandiseNavigation from "../../components/MerchandiseNavigation";
import { api } from "~/trpc/server";
import DetailExchange from "./components/DetailsExcange";

interface MerchandisesExchangeProps {
  merchandisesExchangeId: {
    orderId: string;
    nim: string | null;
    name: string | null;
    status: "Taken" | "Not Taken";
  }[];
  merchandisesExchangeIdDetails: {
    merchandiseId: string;
    merchandiseName: string | null;
    price: number | null;
    quantity: number;
  }[];
}

export default async function DetailMerchandise({
  params,
}: {
  params: {
    id: string;
  };
}) {
  let merchandisesExchangeId: MerchandisesExchangeProps["merchandisesExchangeId"] =
    [];
  let merchandisesExchangeIdDetails: MerchandisesExchangeProps["merchandisesExchangeIdDetails"] =
    [];

  try {
    const response = await api.merchandise.getDetailsExchange({
      id: params.id,
    });

    merchandisesExchangeId = response.res;
    merchandisesExchangeIdDetails = response.details;
  } catch (error) {
    console.error("Failed to fetch merchandises details:", error);
  }
  return (
    <div>
      <div className="flex flex-col gap-4">
        <DashboardHeader title="Merchandise" />
        <MerchandiseNavigation title="Merchandise Exchange" />
        <DetailExchange
          merchandisesExchangeId={merchandisesExchangeId}
          merchandisesExchangeIdDetails={merchandisesExchangeIdDetails}
        />
      </div>
    </div>
  );
}
