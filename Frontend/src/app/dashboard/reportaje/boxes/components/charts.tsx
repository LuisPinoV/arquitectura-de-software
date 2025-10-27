"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  Bar,
  BarChart,
  Cell,
  LabelList,
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

import {
  getCurrentWeekRange,
  getCurrentMonthRange,
  getCurrentYearRange,
} from "@/utils/get_current_dates";
import { useEffect, useState } from "react";
import { Col, Row } from "antd";

export function ChartChangeByMonths() {
  const chartData = [
    { month: "January", hours: 186 },
    { month: "February", hours: 205 },
    { month: "March", hours: -207 },
    { month: "April", hours: 173 },
    { month: "May", hours: -209 },
    { month: "June", hours: 214 },
  ];

  const chartConfig = {
    hours: {
      label: "Horas",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cambio en el uso de boxes</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel hideIndicator />}
            />
            <Bar dataKey="hours">
              <LabelList position="top" dataKey="month" fillOpacity={1} />
              {chartData.map((item) => (
                <Cell
                  key={item.month}
                  fill={item.hours > 0 ? "var(--chart-1)" : "var(--chart-busy)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="text-muted-foreground leading-none">
          Como cambió el uso de boxes a través del tiempo
        </div>
      </CardFooter>
    </Card>
  );
}

export function ChartInfoCards() {
  const [infoCardsData, setInfoCardsData] = useState<any>([
    {
      Nombre: "Uso de boxes",
      Descripcion: "Cantidad",
      Valor: 0,
      MaxValue: 3600,
      fill: "var(--primary)",
    },
    {
      Nombre: "Uso de boxes",
      Descripcion: "Cantidad",
      Valor: 0,
      MaxValue: 3600,
      fill: "var(--primary)",
    },
    {
      Nombre: "Uso de boxes",
      Descripcion: "Cantidad",
      Valor: 0,
      MaxValue: 3600,
      fill: "var(--primary)",
    },
    {
      Nombre: "Uso de boxes",
      Descripcion: "Cantidad",
      Valor: 0,
      MaxValue: 3600,
      fill: "var(--primary)",
    },
  ]);

  useEffect(() => {
    async function fetchData() {
      const today = new Date();
      const yesterday = new Date(today);
      const tomorrow = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      tomorrow.setDate(today.getDate() + 1);

      const yesterdayISO = yesterday.toISOString().split("T")[0];
      const tomorrowISO = tomorrow.toISOString().split("T")[0];

      try {
        const resBoxes = await fetch(
          `/dashboard/reportaje/boxes/api/get_all_boxes_count`
        );
        const countBoxes: any = await resBoxes.json();
        const boxes: any = countBoxes["dataLength"];

        const res1 = await fetch(
          `/dashboard/general/api/usage_by_date?firstDate=${yesterdayISO}&lastDate=${tomorrowISO}`
        );
        const data1: any = await res1.json();
        const usageData1: any = data1["dataArr"][1]["uso"].toFixed(2);
        const dataChart1 = {
          Nombre: "Uso Boxes hoy",
          Descripcion: "Porcentaje",
          Valor: parseFloat(usageData1),
          MaxValue: 100,
          fill: "var(--primary)",
        };

        const res2 = await fetch(
          `/dashboard/reportaje/boxes/api/get_all_scheduling_today_count`
        );
        const data2: any = await res2.json();
        const lenData2: any = data2["dataLength"];
        const dataChart2 = {
          Nombre: "Agendamientos hoy",
          Descripcion: "Cantidad",
          Valor: parseFloat(lenData2),
          MaxValue: boxes * 31,
          fill: "var(--primary)",
        };

        const res3 = await fetch(
          `/dashboard/reportaje/boxes/api/get_all_pending_schedules`
        );

        const data3: any = await res3.json();

        const dataChart3 = {
          Nombre: "Agendamientos por confirmar",
          Descripcion: "Cantidad",
          Valor: parseFloat(data3["pendingCount"]),
          MaxValue: parseFloat(data3["allCount"]),
          fill: "var(--primary)",
        };

        const res4 = await fetch(
          `/dashboard/reportaje/boxes/api/boxes_currently_available_count`
        );

        const data4: any = await res4.json();

        const dataChart4 = {
          Nombre: "Boxes libres",
          Descripcion: "Cantidad",
          Valor: parseFloat(data4["free"]),
          MaxValue: parseFloat(data4["all"]),
          fill: "var(--primary)",
        };

        

        setInfoCardsData([dataChart1, dataChart2, dataChart3, dataChart4]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);
  const chartConfig = {
    amount: {
      label: "Cantidad",
    },
    boxes: {
      label: "Boxes",
      color: "var(--primary)",
    },
  } satisfies ChartConfig;

  return (
    <Card className="p-0 m-2 mb-4">
      <CardHeader className="mt-2 text-lg items-center text-center">
        <CardTitle>Información sobre el uso de boxes</CardTitle>
      </CardHeader>
      <Row justify={"center"} align="middle">
        {infoCardsData.map((data: any, i: number) => (
          <Col
            key={i}
            xxl={6}
            xl={12}
            lg={12}
            md={24}
            style={{
              justifyContent: "center",
              display: "flex",
              margin: "5px 0px",
            }}
          >
            <Card
              style={{
                borderColor: "#00000000",
                boxShadow: "0 0 0",
                maxWidth: "300px",
              }}
            >
              <CardContent>
                <Card
                  className="flex flex-col max-h-[250px] max-w-[250px]"
                  style={{
                    borderRadius: "50%",
                    padding: "0",
                    margin: "0",
                  }}
                >
                  <CardContent className="m-0 p-0">
                    <ChartContainer
                      config={chartConfig}
                      className="mx-auto aspect-square min-w-[250px] max-h-[300px] m-0 p-0"
                    >
                      <RadialBarChart
                        data={[
                          {
                            amount: data.Valor,
                            fill: data.fill,
                            maxValue: data.MaxValue,
                          },
                        ]}
                        endAngle={(data.Valor / data.MaxValue) * 360}
                        innerRadius={"85%"}
                        outerRadius={"142%"}
                      >
                        {console.log(data.maxValue)}
                        <PolarGrid
                          gridType="circle"
                          radialLines={false}
                          stroke="none"
                          className="first:fill-muted last:fill-background m-0 p-0"
                          polarRadius={[105, 88]}
                        />
                        <RadialBar dataKey="amount" background />
                        <PolarRadiusAxis
                          tick={false}
                          tickLine={false}
                          axisLine={false}
                        >
                          <Label
                            content={({ viewBox }) => {
                              if (
                                viewBox &&
                                "cx" in viewBox &&
                                "cy" in viewBox
                              ) {
                                return (
                                  <text
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                  >
                                    <tspan
                                      x={viewBox.cx}
                                      y={viewBox.cy}
                                      className="fill-foreground text-4xl font-bold"
                                    >
                                      {data.Valor.toLocaleString()}
                                    </tspan>
                                    <tspan
                                      x={viewBox.cx}
                                      y={(viewBox.cy || 0) + 24}
                                      className="fill-muted-foreground"
                                    >
                                      {data["Descripcion"]}
                                    </tspan>
                                  </text>
                                );
                              }
                            }}
                          />
                        </PolarRadiusAxis>
                      </RadialBarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </CardContent>
              <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                  {data["Nombre"]}
                </div>
              </CardFooter>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
}

export function ChartBoxesAcrossTime() {
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

  const [chartData, setData] = useState<any[]>([]);
  const [dateRangeType, setDateRangeType] = useState("semanal");

  React.useEffect(() => {
    if (isMobile) {
      setDateRangeType("semanal");
    }
  }, [isMobile]);

  let dateRange: Date[] = getCurrentWeekRange();

  if (dateRangeType === "semanal") {
    dateRange = getCurrentWeekRange();
  } else if (dateRangeType === "mensual") {
    dateRange = getCurrentMonthRange();
  } else if (dateRangeType === "anual") {
    dateRange = getCurrentYearRange();
  }

  const lastDateISO = dateRange[dateRange.length - 1]
    .toISOString()
    .split("T")[0];
  const firstDateISO = dateRange[0].toISOString().split("T")[0];

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `/dashboard/general/api/usage_by_date?firstDate=${firstDateISO}&lastDate=${lastDateISO}`
        );
        const data: any = await res.json();
        setData(data["dataArr"]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [dateRangeType]);

  const filteredData = chartData.map((item) => {
    const date = new Date(item["fecha"]);
    const ocupado = parseFloat(item["uso"]).toFixed(2);
    const libre = (100 - parseFloat(ocupado)).toFixed(2);

    return {
      date: date.toISOString().split("T")[0],
      ocupado: ocupado,
      libre: libre,
    };
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Uso de boxes a través del tiempo</CardTitle>
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
                Esta mes
              </SelectItem>
              <SelectItem value="anual" className="rounded-lg">
                Esta año
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
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

