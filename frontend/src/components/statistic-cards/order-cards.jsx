import {
  IconShoppingCart,
  IconTrendingDown,
  IconTrendingUp,
  IconCurrencyDollar,
  IconReceipt,
} from "@tabler/icons-react";

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

export function OrderCards() {
  const { data, loading, error } = useStatistics({ type: "orders" });

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

  // Helper function to get the top status
  const getTopStatus = () => {
    if (!data?.orders_by_status?.length) return null;
    return data.orders_by_status.reduce((top, current) =>
      current.count > top.count ? current : top
    );
  };

  // Helper function to get status variant
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

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
          <p className="text-destructive">
            Failed to load order statistics: {error}
          </p>
        </div>
      </div>
    );
  }

  const topStatus = getTopStatus();

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Orders Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Orders</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatNumber(data?.total_orders)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconShoppingCart className="size-4" />
              Orders
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {data?.total_orders > 0 ? (
              <>
                Order activity detected <IconTrendingUp className="size-4" />
              </>
            ) : (
              <>
                No orders yet <IconTrendingDown className="size-4" />
              </>
            )}
          </div>
          <div className="text-muted-foreground">
            {data?.orders_by_status?.length || 0} different statuses
          </div>
        </CardFooter>
      </Card>

      {/* Total Revenue Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(data?.revenue_statistics?.total_revenue)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCurrencyDollar className="size-4" />
              Revenue
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {data?.revenue_statistics?.total_revenue > 0 ? (
              <>
                Revenue generated <IconTrendingUp className="size-4" />
              </>
            ) : (
              <>
                No revenue yet <IconTrendingDown className="size-4" />
              </>
            )}
          </div>
          <div className="text-muted-foreground">
            Avg: {formatCurrency(data?.revenue_statistics?.average_order_value)}
          </div>
        </CardFooter>
      </Card>

      {/* Top Order Status Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Top Order Status</CardDescription>
          <CardTitle className="text-xl font-semibold @[250px]/card:text-2xl">
            {topStatus?.status || "No orders"}
          </CardTitle>
          <CardAction>
            <Badge variant={getStatusVariant(topStatus?.status)}>
              <IconReceipt className="size-4" />
              {formatNumber(topStatus?.count || 0)} orders
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {topStatus ? "Most common status" : "No status data"}{" "}
            <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {topStatus && data?.total_orders > 0
              ? `${((topStatus.count / data?.total_orders) * 100).toFixed(
                  1
                )}% of total orders`
              : "No status data available"}
          </div>
        </CardFooter>
      </Card>

      {/* Highest Order Value Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Highest Order</CardDescription>
          <CardTitle className="text-xl font-semibold @[250px]/card:text-2xl">
            {formatCurrency(data?.revenue_statistics?.highest_order_value)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCurrencyDollar className="size-4" />
              Peak Order
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {data?.revenue_statistics?.highest_order_value > 0 ? (
              <>
                Highest value order <IconTrendingUp className="size-4" />
              </>
            ) : (
              <>
                No orders recorded <IconTrendingDown className="size-4" />
              </>
            )}
          </div>
          <div className="text-muted-foreground">
            Lowest:{" "}
            {formatCurrency(data?.revenue_statistics?.lowest_order_value)}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
