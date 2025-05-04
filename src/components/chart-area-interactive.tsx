"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

import { api } from "@/lib/utils";
import { useEffect } from "react";
import { useUser } from "@/app/provider/user-provider";
export const description = "An interactive area chart";

interface ChartDataItem {
  date: string;
  payments: number;
}

interface ApiResponse {
  status: string;
  transactions?: number;
  new_customer?: number;
  success_rate?: number;
  revenue?: number;
  tx?: {
    Month?: string;
    TotalTransactions?: number;
    month?: string;
    total_transactions?: number;
  }[];
}

const chartConfig = {
  payments: {
    label: "Payments",
    color: "var(--blue-9)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [chartData, setChartData] = React.useState<ChartDataItem[]>(() => {
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
      payments: 0,
    }));
  });

  const { userData, dispatch } = useUser();

  const filteredData = chartData.filter((item) => {
    const itemDate = new Date(item.date);
    const currentYear = new Date().getFullYear();
    return itemDate.getFullYear() === currentYear;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<ApiResponse>(
          `/metrics/charts?timeframe=${userData?.timeframe}&mode=${userData?.networkMode}`,
          {
            showErrorToast: false,
          }
        );

        if (response.status === 200 && response.data) {
          const existingData = [...chartData];
          const currentYear = new Date().getFullYear();

          if (response.data.tx && response.data.tx.length > 0) {
            response.data.tx.forEach((item) => {
              const monthStr = item.month || item.Month;
              const transactions =
                item.total_transactions || item.TotalTransactions;

              if (!monthStr) {
                console.error("Missing month in response:", item);
                return;
              }

              const monthMatch = monthStr.trim().match(/([a-zA-Z]+)\s+(\d{4})/);
              if (!monthMatch) {
                console.error("Invalid month format:", monthStr);
                return;
              }

              const month = monthMatch[1];
              const year = parseInt(monthMatch[2]);

              if (year !== currentYear) {
                return;
              }

              const monthIndex = new Date(`${month} 1, 2000`).getMonth();

              const matchingIndex = existingData.findIndex((dataItem) => {
                const itemDate = new Date(dataItem.date);
                return itemDate.getMonth() === monthIndex;
              });

              if (matchingIndex !== -1) {
                existingData[matchingIndex] = {
                  ...existingData[matchingIndex],
                  payments: transactions || 0,
                };
              }
            });
          } else if (response.data.transactions) {
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth();

            const currentMonthIndex = existingData.findIndex((dataItem) => {
              const itemDate = new Date(dataItem.date);
              return itemDate.getMonth() === currentMonth;
            });

            if (currentMonthIndex !== -1) {
              existingData[currentMonthIndex] = {
                ...existingData[currentMonthIndex],
                payments: response.data.transactions,
              };
            }
          } else {
            setChartData([]);
          }

          setChartData(existingData);
          console.log("Updated chart data with current year:", existingData);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchData();
  }, [userData?.networkMode, userData?.timeframe]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Transactions</CardTitle>
        <CardDescription>
          {/* <span className="hidden @[540px]/card:block">
            {userData?.timeframe === "YEARLY" && "Total for the year"}
            {userData?.timeframe === "MONTHLY" && "Total for the last 30 days"}
            {userData?.timeframe === "WEEKLY" && "Total for the last 7 days"}
            {userData?.timeframe === "DAILY" && "Total for the last 24 hours"}
          </span>
          <span className="@[540px]/card:hidden">
            {userData?.timeframe === "YEARLY" && "Yearly"}
            {userData?.timeframe === "MONTHLY" && "Monthly"}
            {userData?.timeframe === "WEEKLY" && "Weekly"}
            {userData?.timeframe === "DAILY" && "Daily"}
          </span> */}
          <span> Total payments for the year</span>
        </CardDescription>
        {/* <CardAction className="flex flex-col gap-2 sm:flex-row">
          <Select
            defaultValue={userData?.timeframe}
            value={userData?.timeframe}
            onValueChange={(value) =>
              dispatch({
                type: "SET_TIMEFRAME",
                payload: value as "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY",
              })
            }
          >
            <SelectTrigger
              className="flex w-40"
              size="sm"
              aria-label="Select time frame"
            >
              <SelectValue placeholder={userData?.timeframe} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="DAILY" className="rounded-lg">
                Daily
              </SelectItem>
              <SelectItem value="WEEKLY" className="rounded-lg">
                Weekly
              </SelectItem>
              <SelectItem value="MONTHLY" className="rounded-lg">
                Monthly
              </SelectItem>
              <SelectItem value="YEARLY" className="rounded-lg">
                Yearly
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            defaultValue={userData?.networkMode}
            value={userData?.networkMode}
            onValueChange={(value) =>
              dispatch({
                type: "SET_NETWORK_MODE",
                payload: value as "MAINNET" | "TESTNET",
              })
            }
          >
            <SelectTrigger
              className="flex w-40"
              size="sm"
              aria-label="Select network mode"
            >
              <SelectValue placeholder={userData?.networkMode} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="MAINNET" className="rounded-lg">
                MAINNET
              </SelectItem>
              <SelectItem value="TESTNET" className="rounded-lg">
                TESTNET
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction> */}
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
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={1.0} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
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
                dataKey="payments"
                type="monotone"
                fill="url(#fillOrders)"
                stroke="#3b82f6"
                stackId="a"
                baseValue={0}
                connectNulls
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[250px] w-full items-center justify-center">
            <p className="text-muted-foreground">
              No chart data available for current year
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
