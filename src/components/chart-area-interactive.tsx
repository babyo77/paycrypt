"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { schema } from "./data-table";
import { api } from "@/lib/utils";
import { useEffect } from "react";

export const description = "An interactive area chart";

interface ChartDataItem {
  date: string;
  orders: number;
}

interface ApiResponse {
  tx: {
    Month: string;
    TotalTransactions: number;
  }[];
}

const chartConfig = {
  orders: {
    label: "Orders",
    color: "var(--green-9)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  // const [timeRange, setTimeRange] = React.useState("90d");
  const [chartData, setChartData] = React.useState<ChartDataItem[]>(() => {
    // Initialize with all months, starting with January
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const currentYear = new Date().getFullYear();

    return months.map((month, index) => ({
      date: new Date(currentYear, index, 15).toISOString().split("T")[0],
      orders: 0,
    }));
  });

  // React.useEffect(() => {
  //   if (isMobile) {
  //     setTimeRange("7d");
  //   }
  // }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    // Always return true to show all months
    return true;

    // Alternative implementation if you want to keep the date filtering logic:
    /*
    const date = new Date(item.date);
    const referenceDate = new Date();
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - 365); // Show last 12 months
    return date >= startDate;
    */
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<ApiResponse>("/metrics/charts", {
          showErrorToast: false,
        });

        if (response.status === 200 && response.data) {
          const existingData = [...chartData];

          response.data.tx.forEach((item) => {
            const monthMatch = item.Month.trim().match(/([a-zA-Z]+)\s+(\d{4})/);
            if (!monthMatch) {
              console.error("Invalid month format:", item.Month);
              return;
            }

            const month = monthMatch[1];
            const year = parseInt(monthMatch[2]);
            const monthIndex = new Date(`${month} 1, 2000`).getMonth();

            // Find the corresponding month in our existing data
            const matchingIndex = existingData.findIndex((dataItem) => {
              const itemDate = new Date(dataItem.date);
              return itemDate.getMonth() === monthIndex;
            });

            // If we found a matching month, update its orders value
            if (matchingIndex !== -1) {
              existingData[matchingIndex] = {
                ...existingData[matchingIndex],
                orders: item.TotalTransactions,
              };
            }
          });

          setChartData(existingData);
          console.log("Updated chart data with all months:", existingData);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Orders</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last 12 months
          </span>
          <span className="@[540px]/card:hidden">12 months</span>
        </CardDescription>
        <CardAction>
          {/* <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup> */}
          {/* <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select> */}
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {filteredData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={1.0} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={5}
                interval="preserveStartEnd"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                  });
                }}
              />
              <YAxis domain={[0, "auto"]} hide />
              <ChartTooltip
                cursor={false}
                defaultIndex={isMobile ? -1 : 10}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />

              <Area
                dataKey="orders"
                type="monotone"
                fill="url(#fillOrders)"
                stroke="#22c55e"
                stackId="a"
                baseValue={0}
                connectNulls
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[250px] w-full items-center justify-center">
            <p className="text-muted-foreground">No chart data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
