"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

import { useRouter } from "next/navigation";
import { useUserProfile } from '@/hooks/use-user';

import { Separator } from "@/components/ui/separator";

import { Calendar } from "@/components/ui/calendar";

import { es } from "react-day-picker/locale";
import "./search-card.css";

const chartConfig = {
  percentage: {
    label: "Ocupancia (%)",
  },
  libre: {
    label: "Libre",
    color: "var(--chart-1)",
  },
  ocupado: {
    label: "Ocupado",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function SearchCard({ data }: any) {

  const ocupancia = parseFloat(data["ocupancia"]);
  
  const ocupanciaRounded = parseFloat(ocupancia.toFixed(1));

  const libreRounded = parseFloat((100 - ocupanciaRounded).toFixed(1));
  
  const chartData = [
    {
      state: "libre",
      percentage: libreRounded,
      fill: "var(--chart-free)",
    },
    {
      state: "ocupado",
      percentage: ocupanciaRounded,
      fill: "var(--chart-busy)",
    },
  ];

  const router = useRouter();

  const handleVisit = () => {
    router.push(`/dashboard/reportaje/${data["idBox"]}`);
  };

  const profile = useUserProfile() as any;
  const space = profile?.spaceName ?? 'Box';

  return (
    <Card className="search-card" style={{ marginTop: "20px" }}>
      <CardHeader>
        <CardTitle className="text-center font-bold search-card-title">
          {`${space} - ${data["box"]}`}
        </CardTitle>
      </CardHeader>
      <CardContent
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] min-h-[200px] w-full p-2"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="percentage"
              label
              nameKey="state"
              innerRadius={"55%"}
              outerRadius={"70%"}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="state" payload={[]} />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
        <CardDescription className="text-center font-semibold m-2 search-card-subtitle">
          Ocupancia hoy
        </CardDescription>
        <Separator className="my-4 mx-0 px-0 w-100" />
        <div className="card-text">
          <p>
            <span className="font-bold card-text-subtitle">Especialidad </span>{" "}
            {data["especialidad"]} <br />
            <span className="font-bold card-text-subtitle">Estado </span>{" "}
            {data["estado"]} <br />
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full" onClick={handleVisit}>
          Visitar
        </Button>
      </CardFooter>
    </Card>
  );
}

export function CalendarSimple() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(Date.now())
  );

  return (
    <div className="bg-background rounded-lg border shadow-sm p-0 m-0">
      <Calendar
        mode="single"
        defaultMonth={date}
        selected={date}
        onSelect={setDate}
        locale={es}
      />
    </div>
  );
}

export function SearchCardPersonal({ data }: any) {

  const ocupancia = parseFloat(data["ocupancia"]);
  
  const ocupanciaRounded = parseFloat(ocupancia.toFixed(1));

  const libreRounded = parseFloat((100 - ocupanciaRounded).toFixed(1));
  
  const chartData = [
    {
      state: "libre",
      percentage: libreRounded,
      fill: "var(--chart-free)",
    },
    {
      state: "ocupado",
      percentage: ocupanciaRounded,
      fill: "var(--chart-busy)",
    },
  ];

  const router = useRouter();

  const handleVisit = () => {
    router.push(`/dashboard/reportaje/${data["name"]}`);
  };

  return (
    <Card className="search-card" style={{ marginTop: "20px" }}>
      <CardHeader>
        <CardTitle className="text-center font-bold search-card-title">
          {data["nombre"]}
        </CardTitle>
      </CardHeader>
      <CardContent
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Separator className="my-4 mx-0 px-0 w-100" />
        <div className="card-text">
          <p>
            <span className="font-bold card-text-subtitle">Especialidad </span>{" "}
            {data["tipo"]} <br />
            <span className="font-bold card-text-subtitle">RUT </span>{" "}
            {data["rut"]} <br />
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full" onClick={handleVisit}>
          Visitar
        </Button>
      </CardFooter>
    </Card>
  );
}