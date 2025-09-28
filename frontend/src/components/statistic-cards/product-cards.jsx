import {
  IconPackage,
  IconTrendingDown,
  IconTrendingUp,
  IconCurrencyDollar,
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

export function ProductCards() {
  const { data, loading, error } = useStatistics({ type: "products" });

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

  // Helper function to strip HTML tags and get plain text
  const stripHtmlTags = (html) => {
    if (!html) return "";
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    // Get text content and clean up extra whitespace
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  // Helper function to get the top category
  const getTopCategory = () => {
    if (!data?.products_by_category?.length) return null;
    return data.products_by_category.reduce((top, current) =>
      current.count > top.count ? current : top
    );
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
            Failed to load product statistics: {error}
          </p>
        </div>
      </div>
    );
  }

  const topCategory = getTopCategory();

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Products Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Products</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatNumber(data?.total_products)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconPackage className="size-4" />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Inventory well stocked <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {data?.products_by_category?.length || 0} categories available
          </div>
        </CardFooter>
      </Card>

      {/* Average Price Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className={"flex items-center justify-between"}>
            Average Price
            <Badge variant="outline">
              <IconCurrencyDollar className="size-4" />
              Competitive
            </Badge>
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(data?.price_statistics?.average)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Price range optimized <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Range: {formatCurrency(data?.price_statistics?.minimum)} -{" "}
            {formatCurrency(data?.price_statistics?.maximum)}
          </div>
        </CardFooter>
      </Card>

      {/* Top Category Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className={"flex items-center justify-between"}>
            Top Category
            <Badge variant="outline">
              <IconTrendingUp className="size-4" />
              {formatNumber(topCategory?.count || 0)} products
            </Badge>
          </CardDescription>
          <CardTitle className="text-xl font-semibold @[250px]/card:text-2xl">
            {topCategory?.category_name || "No categories"}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Leading category <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {topCategory
              ? `${((topCategory.count / data?.total_products) * 100).toFixed(
                  1
                )}% of total inventory`
              : "No category data available"}
          </div>
        </CardFooter>
      </Card>

      {/* Most Popular Product Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Featured Product</CardDescription>
          <CardTitle className="text-xl font-semibold @[250px]/card:text-2xl">
            {data?.most_popular_products?.[0]?.name || "No products"}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCurrencyDollar className="size-4" />
              {formatCurrency(data?.most_popular_products?.[0]?.price)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Premium product <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {(() => {
              const description = data?.most_popular_products?.[0]?.description;
              if (!description) return "No description available";

              const cleanText = stripHtmlTags(description);
              return cleanText.length > 40
                ? `${cleanText.substring(0, 40)}...`
                : cleanText || "No description available";
            })()}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
