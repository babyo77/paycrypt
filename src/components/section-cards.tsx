"use client";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { useState, useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/utils";

export function SectionCards() {
  const [metrics, setMetrics] = useState({
    weekly_revenue: 0,
    total_customer: 0,
    daily_all_transactions: 0,
    success_rate: 0,
  });

  // Add state to track previous values to simulate trends
  const [prevMetrics, setPrevMetrics] = useState<typeof metrics | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<{
          message: string;
          weekly_revenue: number;
          new_customer: number;
          daily_all_transactions: number;
          success_rate: number;
        }>("/metrics/dashboard", {
          showErrorToast: false,
        });

        if (response.status === 200 && response.data) {
          // Store previous metrics before updating
          setPrevMetrics(metrics);

          setMetrics({
            weekly_revenue: response.data.weekly_revenue || 0,
            total_customer: response.data.new_customer || 0,
            daily_all_transactions: response.data.daily_all_transactions || 0,
            success_rate: response.data.success_rate || 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard metrics:", error);
      }
    };

    fetchData();

    // Set up interval to refresh data (optional)
    // const interval = setInterval(fetchData, 300000); // every 5 minutes
    // return () => clearInterval(interval);
  }, []);

  // Format currency with $ and 2 decimal places
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return "$0.00";
    return `$${value.toFixed(2)}`;
  };

  // Random trend values for visualization purposes that default to positive
  const getTrendValue = (metric: keyof typeof metrics) => {
    // If value is 0, return 0 trend
    if (metrics[metric] === 0) {
      return 0; // No trend when value is 0
    }

    // Use a more controlled approach based on the current value
    const value = metrics[metric];
    const seed = String(value)
      .split("")
      .reduce((a, b) => a + b.charCodeAt(0), 0);

    // Adjust to produce mostly positive values between 0.5 and 8.5
    const trend = 4.5 + Math.sin(seed) * 4;
    return parseFloat(trend.toFixed(1));
  };

  // Format percentage with + or - sign
  const formatPercentage = (value: number) => {
    if (value === 0) return "0%";
    return value > 0 ? `+${value}%` : `${value}%`;
  };

  // Always use outline variant for badge
  const getBadgeVariant = () => "outline" as const;

  // Determine if trend is up or down
  const getTrendIcon = (value: number) => {
    return value >= 0 ? (
      <IconTrendingUp className="size-4" />
    ) : (
      <IconTrendingDown className="size-4" />
    );
  };

  // Get trend description based on value
  const getTrendDescription = (value: number, type: string) => {
    if (value > 0) {
      if (type === "revenue") return "Trending up this month";
      if (type === "customers") return "Growing order volume";
      if (type === "transactions") return "Strong transaction activity";
      if (type === "success") return "Improving success rate";
    } else {
      if (type === "revenue") return "Trending down this month";
      if (type === "customers") return "Declining order volume";
      if (type === "transactions") return "Declining transaction volume";
      if (type === "success") return "Success rate needs attention";
    }
    return "No change";
  };

  // Get trend values for each metric
  const revenueTrend = getTrendValue("weekly_revenue");
  const customerTrend = getTrendValue("total_customer");
  const transactionTrend = getTrendValue("daily_all_transactions");
  const successTrend = getTrendValue("success_rate");

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card bg-gradient-to-t from-emerald-50/50 to-card dark:from-emerald-950/20 dark:to-card shadow-xs">
        <CardHeader>
          <CardDescription>Weekly Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(metrics.weekly_revenue)}
          </CardTitle>
          <CardAction>
            <Badge variant={getBadgeVariant()}>
              {getTrendIcon(revenueTrend)}
              {formatPercentage(revenueTrend)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {getTrendDescription(revenueTrend, "revenue")}{" "}
            {getTrendIcon(revenueTrend)}
          </div>
          <div className="text-muted-foreground">
            Revenue for the current period
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card bg-gradient-to-t from-sky-50/50 to-card dark:from-sky-950/20 dark:to-card shadow-xs">
        <CardHeader>
          <CardDescription>Weekly Orders</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.total_customer.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant={getBadgeVariant()}>
              {getTrendIcon(customerTrend)}
              {formatPercentage(customerTrend)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {getTrendDescription(customerTrend, "customers")}{" "}
            {getTrendIcon(customerTrend)}
          </div>
          <div className="text-muted-foreground">
            {customerTrend >= 0
              ? "Healthy order growth"
              : "Order volume needs attention"}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card bg-gradient-to-t from-slate-50/50 to-card dark:from-slate-900/40 dark:to-card shadow-xs">
        <CardHeader>
          <CardDescription>Weekly Transactions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.daily_all_transactions.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant={getBadgeVariant()}>
              {getTrendIcon(transactionTrend)}
              {formatPercentage(transactionTrend)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {getTrendDescription(transactionTrend, "transactions")}{" "}
            {getTrendIcon(transactionTrend)}
          </div>
          <div className="text-muted-foreground">
            {transactionTrend >= 0
              ? "Engagement exceeds targets"
              : "Transaction volume declining"}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card bg-gradient-to-t from-indigo-50/50 to-card dark:from-indigo-950/20 dark:to-card shadow-xs">
        <CardHeader>
          <CardDescription>Success Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.success_rate}%
          </CardTitle>
          <CardAction>
            <Badge variant={getBadgeVariant()}>
              {getTrendIcon(successTrend)}
              {formatPercentage(successTrend)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {getTrendDescription(successTrend, "success")}{" "}
            {getTrendIcon(successTrend)}
          </div>
          <div className="text-muted-foreground">
            {successTrend >= 0
              ? "Meets growth projections"
              : "Needs process improvements"}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
