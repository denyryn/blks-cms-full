import {
  IconMail,
  IconMailOpened,
  IconClock,
  IconTrendingUp,
  IconTrendingDown,
  IconUser,
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

export function GuestMessageCards() {
  const { data, loading, error } = useStatistics({ type: "guest-messages" });

  // Helper function to format numbers
  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US").format(num || 0);
  };

  // Helper function to format percentage
  const formatPercentage = (num) => {
    return `${(num || 0).toFixed(1)}%`;
  };

  // Helper function to format hours
  const formatResponseTime = (hours) => {
    if (hours === null || hours === undefined || hours < 0) {
      return "No response yet";
    }
    if (hours < 1) {
      return `${Math.round(hours * 60)} minutes`;
    }
    if (hours < 24) {
      return `${hours.toFixed(1)} hours`;
    }
    return `${(hours / 24).toFixed(1)} days`;
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "No messages";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 sm:grid-cols-2 lg:grid-cols-4">
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
            Failed to load guest message statistics: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Messages Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Messages</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatNumber(data?.total_messages)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconMail className="size-4" />
              Messages
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {data?.total_messages > 0 ? (
              <>
                Customer inquiries received{" "}
                <IconTrendingUp className="size-4" />
              </>
            ) : (
              <>
                No messages yet <IconTrendingDown className="size-4" />
              </>
            )}
          </div>
          <div className="text-muted-foreground">
            {data?.recent_messages || 0} recent messages
          </div>
        </CardFooter>
      </Card>

      {/* Unread Messages Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Unread Messages</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatNumber(data?.unread_messages)}
          </CardTitle>
          <CardAction>
            <Badge
              variant={data?.unread_messages > 0 ? "destructive" : "outline"}
            >
              <IconMail className="size-4" />
              {data?.unread_messages > 0 ? "Needs Attention" : "Up to Date"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {data?.unread_messages > 0 ? (
              <>
                Pending responses <IconTrendingUp className="size-4" />
              </>
            ) : (
              <>
                All caught up <IconTrendingDown className="size-4" />
              </>
            )}
          </div>
          <div className="text-muted-foreground">
            {formatNumber(data?.read_messages)} messages read
          </div>
        </CardFooter>
      </Card>

      {/* Response Rate Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Response Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatPercentage(data?.response_rate)}
          </CardTitle>
          <CardAction>
            <Badge
              variant={
                data?.response_rate >= 80
                  ? "default"
                  : data?.response_rate >= 50
                  ? "secondary"
                  : "destructive"
              }
            >
              <IconMailOpened className="size-4" />
              {data?.response_rate >= 80
                ? "Excellent"
                : data?.response_rate >= 50
                ? "Good"
                : "Needs Improvement"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Response performance{" "}
            {data?.response_rate >= 50 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            Based on read vs total messages
          </div>
        </CardFooter>
      </Card>

      {/* Latest Message Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Latest Message</CardDescription>
          <CardTitle className="text-xl font-semibold @[250px]/card:text-2xl">
            {data?.latest_message?.name || "No messages"}
          </CardTitle>
          <CardAction>
            <Badge
              variant={
                data?.latest_message?.is_read ? "default" : "destructive"
              }
            >
              {data?.latest_message?.is_read ? (
                <IconMailOpened className="size-4" />
              ) : (
                <IconMail className="size-4" />
              )}
              {data?.latest_message?.is_read ? "Read" : "Unread"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <IconUser className="size-4" />
            Most recent inquiry
          </div>
          <div className="text-muted-foreground">
            {data?.latest_message?.created_at
              ? `Received ${formatDate(data.latest_message.created_at)}`
              : "No messages yet"}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
