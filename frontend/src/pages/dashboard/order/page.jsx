import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination";
import { OrderCards } from "@/components/statistic-cards/order-cards";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useMemo } from "react";

import { columns } from "./columns";
import { useOrders } from "@/hooks/use-orders";
import { useNavigate } from "react-router";

export default function OrderPage() {
  const { data, loading, error, pagination, setPagination, refreshData } =
    useOrders(0, 15); // initial page + pageSize

  const navigate = useNavigate();

  const memoizedColumns = useMemo(() => columns(refreshData), [refreshData]);

  const handlePageChange = (page) => {
    setPagination(page);
  };

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <OrderCards />

      <section className="p-6 gap-y-4 flex flex-col items-end">
        <DataTable
          columns={memoizedColumns}
          data={data}
          pagination={pagination}
          isLoading={loading}
        />

        <div>
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </div>
      </section>
    </div>
  );
}
