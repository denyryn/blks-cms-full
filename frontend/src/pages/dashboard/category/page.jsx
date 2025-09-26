import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination";
import { ProductCards } from "@/components/statistic-cards/product-cards";
import { CategoryModal } from "@/components/category/data-category-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useMemo } from "react";

import { columns } from "./columns";
import { useCategories } from "@/hooks/use-categories";

export default function CategoryPage() {
  const { data, loading, error, pagination, setPagination, refreshData } =
    useCategories(0, 15);

  const memoizedColumns = useMemo(() => columns(refreshData), [refreshData]);

  const handlePageChange = (page) => {
    setPagination(page);
  };

  function addTrigger() {
    return (
      <Button variant="outline" className="w-12">
        <Plus className="size-4" />
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <ProductCards />

      <section className="p-6 gap-y-4 flex flex-col items-end">
        <CategoryModal
          initial=""
          trigger={addTrigger()}
          onSuccess={refreshData}
        />

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
