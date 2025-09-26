import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStatistics } from "@/hooks/use-statistics";

export function DashboardCards() {
  const { data, loading, error } = useStatistics({ type: "dashboard" });

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  // Helper function to format numbers
  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US").format(num || 0);
  };

  // Helper function to calculate percentage change
  const calculateChange = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  // Calculate growth/trends (comparing this week vs previous period)
  const revenueChange = data?.this_week?.revenue
    ? calculateChange(data.this_week.revenue, data.today.revenue)
    : "+12.5";

  const usersChange = data?.this_week?.new_users
    ? calculateChange(data.this_week.new_users, data.today.new_users)
    : "+12.5";

  if (loading) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <CardDescription>
                <Skeleton className="h-4 w-20" />
              </CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                <Skeleton className="h-8 w-24" />
              </CardTitle>
              <CardAction>
                <Skeleton className="h-6 w-16" />
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-28" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 lg:px-6">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
          <p className="text-destructive">Failed to load statistics: {error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Revenue Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(data?.totals?.revenue)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {parseFloat(revenueChange) >= 0 ? (
                <IconTrendingUp />
              ) : (
                <IconTrendingDown />
              )}
              {parseFloat(revenueChange) >= 0 ? "+" : ""}
              {revenueChange}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {parseFloat(revenueChange) >= 0 ? "Trending up" : "Trending down"}{" "}
            this week{" "}
            {parseFloat(revenueChange) >= 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            Weekly revenue: {formatCurrency(data?.this_week?.revenue)}
          </div>
        </CardFooter>
      </Card>

      {/* Total Users Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatNumber(data?.totals?.users)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {parseFloat(usersChange) >= 0 ? (
                <IconTrendingUp />
              ) : (
                <IconTrendingDown />
              )}
              {parseFloat(usersChange) >= 0 ? "+" : ""}
              {usersChange}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {data?.this_week?.new_users || 0} new this week{" "}
            {parseFloat(usersChange) >= 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">User growth continues</div>
        </CardFooter>
      </Card>

      {/* Total Products Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Products</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatNumber(data?.totals?.products)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              Stable
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Product catalog stable <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Inventory management on track
          </div>
        </CardFooter>
      </Card>

      {/* Total Orders Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Orders</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatNumber(data?.totals?.orders)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {data?.this_week?.orders > 0 ? (
                <IconTrendingUp />
              ) : (
                <IconTrendingDown />
              )}
              {data?.this_week?.orders || 0} this week
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {data?.this_week?.orders > 0 ? "Orders coming in" : "No orders yet"}{" "}
            {data?.this_week?.orders > 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            {data?.this_week?.orders > 0
              ? "Sales momentum building"
              : "Waiting for first orders"}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
