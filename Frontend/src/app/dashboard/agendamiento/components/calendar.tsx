"use client";

import * as React from "react";

import { Calendar } from "@/components/ui/calendar";
import { es } from "react-day-picker/locale";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CalendarScheduling() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="flex flex-col gap-1 p-0 m-0">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-lg border [--cell-size:--spacing(8)] md:[--cell-size:--spacing(12)] sm:[--cell-size:--spacing(10)]"
        locale={es}
        defaultMonth={date}
        captionLayout={"dropdown"}
        buttonVariant="ghost"
      />
    </div>
  );
}
