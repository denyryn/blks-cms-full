import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DashboardCards } from "@/components/statistic-cards/dashboard-cards";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <DashboardCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
    </div>
  );
}
