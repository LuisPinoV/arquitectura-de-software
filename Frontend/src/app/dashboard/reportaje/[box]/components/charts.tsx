"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import {
  getCurrentMonthRange,
  getCurrentWeekRange,
  getCurrentYearRange,
} from "@/utils/get_current_dates";
import { useUserProfile } from "@/hooks/use-user";
import { getUserProfile } from "@/utils/get_user_profile";

export function ChartBoxAcrossTime({
  idbox,
  dataArr,
}: {
  idbox: string;
  dataArr?: any[];
}) {
  const chartConfig = {
    libre: {
      label: "Libre (%)",
      color: "var(--chart-days)",
    },
    ocupado: {
      label: "Ocupado (%)",
      color: "var(--chart-days)",
    },
  } satisfies ChartConfig;

  const isMobile = useIsMobile();

  const [clientProfile, setClientProfile] = useState<any>(null);

  useEffect(() => {
    const p = getUserProfile();
    setClientProfile(p);
  }, []);

  const space = clientProfile?.spaceName ?? "Espacio";

  const [chartData, setData] = useState<any[]>(dataArr ?? []);
  const [dateRangeType, setDateRangeType] = useState("semanal");

  React.useEffect(() => {
    if (isMobile) {
      setDateRangeType("semanal");
    }
  }, [isMobile]);

  let dateRange: Date[] = getCurrentWeekRange();
  if (dateRangeType === "semanal") dateRange = getCurrentWeekRange();
  if (dateRangeType === "mensual") dateRange = getCurrentMonthRange();
  if (dateRangeType === "anual") dateRange = getCurrentYearRange();

  const lastDateISO = dateRange[dateRange.length - 1]
    .toISOString()
    .split("T")[0];
  const firstDateISO = dateRange[0].toISOString().split("T")[0];

  useEffect(() => {
    if (dataArr) {
      setData(dataArr);
      return;
    }

    async function fetchData() {
      try {
        const res = await apiFetch(
          `/api/reports/get_box_ocupancy_data_by_date?idBox=${idbox}&startDate=${firstDateISO}&endDate=${lastDateISO}`
        );
        const data: any = await res?.json();
        setData(data ?? []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [dateRangeType, idbox, firstDateISO, lastDateISO, dataArr]);

  const filteredData = chartData.map((item) => {
    const date = new Date(item.date ?? null);
    const ocupado = (parseFloat(item["ocupancia"] ?? 0) * 100).toFixed(2);
    const libre = (100 - parseFloat(ocupado ?? 0)).toFixed(2);

    return {
      date: date.toISOString().split("T")[0],
      ocupado: Number(ocupado),
      libre: Number(libre),
    };
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Uso de {space} a través del tiempo</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">Total en el tiempo</span>
        </CardDescription>
        <CardAction className="w-full">
          <ToggleGroup
            type="single"
            value={dateRangeType}
            onValueChange={setDateRangeType}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[600px]/card:flex"
          >
            <ToggleGroupItem value="semanal">Esta semana</ToggleGroupItem>
            <ToggleGroupItem value="mensual">Este mes</ToggleGroupItem>
            <ToggleGroupItem value="anual">Este año</ToggleGroupItem>
          </ToggleGroup>
          <Select value={dateRangeType} onValueChange={setDateRangeType}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[600px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="semanal" className="rounded-lg">
                Esta semana
              </SelectItem>
              <SelectItem value="mensual" className="rounded-lg">
                Este mes
              </SelectItem>
              <SelectItem value="anual" className="rounded-lg">
                Este año
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[290px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("es-CL", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={3}
              domain={[0, 100]}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("es-CL", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="ocupado"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--chart-1)"
              stackId="a"
            />
            <Area
              dataKey="libre"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-primary)"
              stackId="b"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function BoxSchedule({ idbox }: { idbox: string }) {
  const [chartData, setChartData] = useState<
    { month: string; ocupancia: number }[]
  >([]);

  useEffect(() => {
    async function fetchChartData() {
      const res = await apiFetch(
        `/api/reports/get_box_ocupancy_data?idBox=${idbox}`
      );
      const data = await res?.json();
      setChartData(data ?? []);
    }

    fetchChartData();
  }, [idbox]);

  const [clientProfile, setClientProfile] = useState<any>(null);

  useEffect(() => {
    const p = getUserProfile();
    setClientProfile(p);
  }, []);

  const space = clientProfile?.spaceName ?? "Espacio";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agendamiento de {space} en el año</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{ ocupancia: { label: "Cantidad", color: "var(--chart-1)" } }}
          className="aspect-auto h-[330px] w-full"
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis domain={[0, "dataMax"]} tickLine={false} axisLine={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="ocupancia" fill="var(--color-ocupancia)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
