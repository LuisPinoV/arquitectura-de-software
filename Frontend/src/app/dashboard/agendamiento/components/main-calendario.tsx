"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Col, Row } from "antd";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Schedule = {
  idAgendamiento: number;
  time: string;
  status: "Libre" | "Ocupado";
};

type Box = {
  idBox: number;
  schedules: Record<string, Schedule[]>;
};

const PAGE_SIZE = 7;

export default function BoxSchedulePage() {
  const [open, setOpen] = React.useState(false);
  const [selectedBoxId, setSelectedBoxId] = React.useState<number | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    undefined
  );

  const [page, setPage] = React.useState(1);
  const [allBoxes, setAllBoxes] = React.useState<string[]>([]);
  const [simpleAction, setSimpleAction] = React.useState<boolean>(true);

  const [boxes, setBoxes] = React.useState<Box[]>([]);

  React.useEffect(() => {
    setPage(1);
  }, [selectedDate, selectedBoxId]);

  React.useEffect(() => {
    if (!selectedBoxId) {
      return;
    }

    async function fetchScheduling() {
      const curDate = selectedDate ? selectedDate : new Date();

      try {
        const res = await fetch(
          `/dashboard/agendamiento/api/get_all_schedules_by_box_date?date=${
            curDate.toISOString().split("T")[0]
          }&box=${selectedBoxId}`
        );
        const data: any = await res.json();
        setBoxes(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchScheduling();
  }, [selectedDate, selectedBoxId, simpleAction]);

  React.useEffect(() => {
    async function fetchBoxes() {
      try {
        const res = await fetch(`/dashboard/agendamiento/api/get_boxes`);
        const data: any = await res.json();
        setAllBoxes(data["boxes"]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchBoxes();
  }, []);

  const selectedBox = boxes.find((b) => b.idBox === selectedBoxId);

  const dateKey = selectedDate?.toISOString().split("T")[0] || "";
  const schedules = selectedBox?.schedules[dateKey] || [];

  // Pagination logic
  const totalPages = Math.ceil(schedules.length / PAGE_SIZE);
  const paginatedSchedules = schedules.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleCancelSchedule = (idAgendamiento:string) =>
  {
    async function cancelSchedule(idAgendamiento:string) {
      try {
        await fetch(`/dashboard/agendamiento/api/cancel_schedule?id=${idAgendamiento}`);
        setSimpleAction(!simpleAction);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    cancelSchedule(idAgendamiento);
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Selecciona un Box</CardTitle>
        </CardHeader>
        <CardContent>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[250px] justify-between"
              >
                {selectedBoxId ? `BOX - ${selectedBoxId}` : "Elige un box..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
              <Command>
                <CommandInput placeholder="Buscar box..." />
                <CommandEmpty>No se encontró box.</CommandEmpty>
                <CommandGroup className = "max-h-[150px]" style = {{overflowY:"scroll"}}>
                  {allBoxes.map((box) => (
                    <CommandItem
                      key={box}
                      value={box}
                      onSelect={() => {
                        setSelectedBoxId(parseInt(box));
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          parseInt(box) === selectedBoxId
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {`BOX - ${box}`}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {selectedBox && (
        <Card>
          <CardHeader>
            <CardTitle>Calendario de {`BOX - ${selectedBox.idBox}`}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-6 w-full">
            <Row className="w-full" align={"middle"} justify={"center"}>
              <Col xl={8} sm={24}>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </Col>
              <Col xl={16} sm={24} style={{ margin: "10px 0px" }}>
                <div className="flex-1 w-full">
                  <h3 className="font-semibold mb-2">
                    Horarios para {dateKey || "fecha no seleccionada"}
                  </h3>
                  {schedules.length > 0 ? (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Hora</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Acción</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedSchedules.map((sch, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{sch.time}</TableCell>
                              <TableCell
                                className={
                                  sch.status === "Ocupado"
                                    ? "text-red-500"
                                    : "text-green-500"
                                }
                              >
                                {sch.status}
                              </TableCell>
                              <TableCell>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant={
                                        sch.status === "Ocupado"
                                          ? "default"
                                          : "secondary"
                                      }
                                    >
                                      {sch.status === "Ocupado"
                                        ? "Cancelar"
                                        : "Ver"}
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                      <DialogTitle>
                                        {sch.status === "Ocupado"
                                          ? "¿Cancelar agendamiento?"
                                          : "Información agendamiento"}
                                      </DialogTitle>
                                    </DialogHeader>
                                    <div className="flex items-center gap-2">
                                      <div className="grid flex-1 gap-2">
                                        <div>Box - {selectedBox?.idBox}</div>
                                        <div>Hora - {sch.time}</div>
                                      </div>
                                    </div>
                                    <DialogFooter className="sm:justify-start">
                                      <DialogClose asChild>
                                        <Button
                                          type="button"
                                          variant="secondary"
                                        >
                                          Cerrar
                                        </Button>
                                      </DialogClose>
                                      <DialogClose asChild>
                                        <Button type="button" variant="default" onClick={sch.status === "Ocupado" ? (_) => handleCancelSchedule(String(sch.idAgendamiento)) : (_) => {}}>
                                          Confirmar
                                        </Button>
                                      </DialogClose>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="flex justify-between items-center mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={page === 1}
                          onClick={() => setPage((p) => p - 1)}
                        >
                          ← Anterior
                        </Button>
                        <span>
                          Página {page} de {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={page === totalPages}
                          onClick={() => setPage((p) => p + 1)}
                        >
                          Siguiente →
                        </Button>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground">
                      No hay horarios para esta fecha.
                    </p>
                  )}
                </div>
              </Col>
            </Row>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
