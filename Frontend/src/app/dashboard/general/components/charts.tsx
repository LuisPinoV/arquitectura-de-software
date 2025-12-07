"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Rectangle,
  XAxis,
  YAxis,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Label,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import React from "react";
import DynamicSpaceLabel from '@/components/dynamic-space-label';
import { useUserProfile } from '@/hooks/use-user';

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { ChevronDownIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";

import { es } from "react-day-picker/locale";

import {
  getCurrentMonthRange,
  getCurrentWeekRange,
  getCurrentYearRange,
} from "utils/get_current_dates";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

export function GraficoConcentracionPorEspecialidad() {
  const [chartData, setData] = useState<any[]>([]);

  const isMobile = useIsMobile();
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
          `/api/general/boxes_per_specialty?firstDate=${firstDateISO}&lastDate=${lastDateISO}`
        );
        const data: any = await res.json();
        setData(data ?? []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [dateRangeType]);

  const specialties = chartData.map((val: any) => val["specialty"]);

  const chartConfig: ChartConfig = {
    percentage: { label: "Ocupancia (%)" },
    ...specialties.reduce((acc, specialty) => {
      const key = specialty;
      acc[key] = { label: specialty };
      return acc;
    }, {} as ChartConfig),
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(0);
  const [bottomMargin, setBottomMargin] = useState(0);
  const [leftMargin, setLeftMargin] = useState(0);
  const [textAnchor, setTextAnchor] = useState<"start" | "middle" | "end">(
    "middle"
  );
  useEffect(() => {
    const updateAngle = () => {
      const width = containerRef.current?.offsetWidth || 0;
      if (width < 370 && width >= 250) {
        setAngle(-45);
        setTextAnchor("end");
        setBottomMargin(40);
        setLeftMargin(10);
      } else if (width < 250) {
        setAngle(-60);
        setTextAnchor("end");
        setBottomMargin(50);
        setLeftMargin(20);
      } else {
        setAngle(0);
        setTextAnchor("middle");
        setBottomMargin(0);
        setLeftMargin(0);
      }
    };

    updateAngle();
    window.addEventListener("resize", updateAngle);
    return () => window.removeEventListener("resize", updateAngle);
  }, []);

  return (
    <Card className="@container/card chart-card">
      <CardHeader>
        <CardDescription><DynamicSpaceLabel template="Uso boxes por categoría" /></CardDescription>
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
                Este año
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          ref={containerRef}
          className="w-full min-h-[300px]"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ bottom: bottomMargin, left: leftMargin }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="specialty"
              tickLine={false}
              tickMargin={4}
              angle={angle}
              axisLine={false}
              interval={0}
              tickFormatter={(value) => pascalToWords(value)
              }
              textAnchor={textAnchor}
            />
            <YAxis domain={[0, 100]} />
            <ChartTooltip
              cursor={true}
              content={
                <ChartTooltipContent
                  hideLabel
                  color="var(--chart-specialties)"
                />
              }
            />
            <defs>
              <linearGradient id={`specialtiesBar`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="1%"
                  stopColor="var(--chart-specialties)"
                  stopOpacity={0.95}
                />
                <stop
                  offset="100%"
                  stopColor="var(--chart-specialties)"
                  stopOpacity={0.5}
                />
              </linearGradient>
            </defs>
            <Bar
              dataKey="percentage"
              strokeWidth={2}
              radius={18}
              fillOpacity={1.0}
              fill="url(#specialtiesBar)"
              activeBar={({ ...props }) => {
                return (
                  <Rectangle
                    {...props}
                    fillOpacity={0.7}
                    stroke="url(#specialtiesBar)"
                    fill="url(#specialtiesBar)"
                  />
                );
              }}
            >
              <LabelList
                position="top"
                offset={5}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function GraficoUsoSemanal() {
  const chartConfig = {
    percentage: {
      label: "Porcentaje (%)",
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
          `/api/general/usage_by_date?firstDate=${firstDateISO}&lastDate=${lastDateISO}`
        );
        const data: any = await res.json();
        setData(data ?? []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [dateRangeType]);

  return (
    <Card className="@container/card chart-card">
      <CardHeader>
        <CardDescription><DynamicSpaceLabel template="Uso porcentual de boxes" /></CardDescription>
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
            <ToggleGroupItem value="anual">Esta año</ToggleGroupItem>
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
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full min-h-[300px]">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: -24,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="fecha"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
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
              cursor={true}
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
            <defs>
              <linearGradient id="fillDays" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="1%"
                  stopColor="var(--chart-days)"
                  stopOpacity={0.95}
                />
                <stop
                  offset="99%"
                  stopColor="var(--background)"
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="uso"
              type="natural"
              fill="url(#fillDays)"
              fillOpacity={0.8}
              stroke="var(--chart-days-stroke)"
              strokeWidth={1}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function BoxesSpeficicChart() {
  const profile = useUserProfile ? useUserProfile() as any : null;
  const space = profile?.spaceName ?? 'Boxes';

  const chartConfig = {
    libre: {
      label: "Libre",
      color: "var(--chart-1)",
    },
    ocupado: {
      label: "Ocupado",
      color: "var(--chart-2)",
    },
    ocupancia: {
      label: `Ocupancia ${space}`,
      color: "var(--chart-specialties)",
    },
  } satisfies ChartConfig;

  const [specialties, setSpecialties] = React.useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/general/get_specialties`);
        const data: any = await res.json();
        setSpecialties(data ?? []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const specialtes_dict: any[] = [];
  const [openSpecialty, setOpenSpecialty] = React.useState(false);
  const [value, setValue] = React.useState("");

  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const [busy, setBusy] = React.useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/general/get_specialties`);
        const data: any = await res.json();
        if (data && data.length > 0) {
          setValue(data[0]["especialidad"]);
        } else {
          setValue("");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  for (let i = 0; i < specialties.length; i++) {
    const specialty: any = specialties[i];
    specialtes_dict.push({
      value: specialty["especialidad"],
      label: specialty["especialidad"],
    });
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `/api/general/use_by_specialty_and_date?specialty=${value}&date=${
            date?.toISOString().split("T")[0]
          }`
        );
        const data: any = await res.json();
        setBusy(parseFloat(data["number"] ?? 0));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [value, date]);

  const dataBoxGeneral = [
    {
      ocupancia: "Ocupancia boxes",
      libre: 100 - busy,
      ocupado: busy,
    },
  ];

  return (
    <div>
      <ChartContainer config={chartConfig} className="min-h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={dataBoxGeneral}
            endAngle={360}
            innerRadius="80%"
            outerRadius="120%"
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {dataBoxGeneral[0].ocupado.toLocaleString() + "%"}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 16}
                          className="fill-muted-foreground"
                        >
                          {dataBoxGeneral[0].ocupancia}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="ocupado"
              stackId="a"
              cornerRadius={5}
              fill="var(--chart-busy)"
              className="stroke-transparent stroke-2 w-100"
            />
            <RadialBar
              dataKey="libre"
              fill="var(--chart-free)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </ChartContainer>
      <div className="flex flex-col gap-3">
        <Popover open={openSpecialty} onOpenChange={setOpenSpecialty}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openSpecialty}
              className="justify-between font-normal mx-4 my-2"
            >
              {value
                ? specialtes_dict.find((framework) => framework.value === value)
                    ?.label
                : "Elige categoría"}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-1  ">
            <Command>
              <CommandInput
                placeholder="Buscar categoría..."
                className="h-9"
              />
              <CommandList>
                <CommandEmpty>No especilidad encontrada.</CommandEmpty>
                <CommandGroup>
                  {specialtes_dict.map((framework) => (
                    <CommandItem
                      key={framework.value}
                      value={framework.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpenSpecialty(false);
                      }}
                    >
                      {framework.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === framework.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="justify-between font-normal mx-4 me-4"
            >
              {date ? date.toLocaleDateString() : "Elige fecha"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              locale={es}
              onSelect={(date) => {
                setDate(date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function pascalToWords(text: string): string {
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2")   // insert space before uppercase
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2") // handle consecutive caps
    .replace(/^./, (str) => str.toUpperCase()); // capitalize first letter
}