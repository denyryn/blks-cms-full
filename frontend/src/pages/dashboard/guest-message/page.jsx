import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination";
import { GuestMessageCards } from "@/components/statistic-cards/guest-message-cards";
import { useMemo } from "react";

import { columns } from "./columns";
import { useGuestMessages } from "@/hooks/use-guest-messages";
import { useNavigate } from "react-router";

export default function GuestMessagePage() {
  const { data, loading, error, pagination, setPagination, refreshData } =
    useGuestMessages(0, 15); // initial page + pageSize

  const navigate = useNavigate();

  const memoizedColumns = useMemo(() => columns(refreshData), [refreshData]);

  const handlePageChange = (page) => {
    setPagination(page);
  };

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <GuestMessageCards />

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
