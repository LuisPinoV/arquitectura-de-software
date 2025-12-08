"use client";

import * as React from "react";
import { useUserProfile } from "@/hooks/use-user";
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
import { apiFetch } from "@/lib/apiClient";

type Schedule = {
  idAgendamiento: number;
  time: string;
  status: "Libre" | "Ocupado";
};

const PAGE_SIZE = 7;

export default function BoxSchedulePage() {
  const profile = useUserProfile() as any;
  const space = profile?.spaceName ?? "Box";
  const spaceUpper = space.toUpperCase();
  const spaceLower = space.toLowerCase();
  const [open, setOpen] = React.useState(false);
  const [selectedSpaceId, setSelectedSpaceId] = React.useState<string | null>(
    null
  );
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    undefined
  );

  const [page, setPage] = React.useState(1);
  const [allSpaces, setAllSpaces] = React.useState<any[]>([]);
  const [simpleAction, setSimpleAction] = React.useState<boolean>(true);

  const [spaceSchedules, setSpaceSchedules] = React.useState<Schedule[]>([]);
  const [selectedSpace, setSelectedSpace] = React.useState<any | undefined>(
    undefined
  );

  React.useEffect(() => {
    setPage(1);
  }, [selectedDate, selectedSpaceId]);

  React.useEffect(() => {
    if (!selectedSpaceId) {
      return;
    }

    async function fetchScheduling() {
      const curDate = selectedDate ? selectedDate : new Date();

      try {
        const dateOnly = curDate.toISOString().split("T")[0];
        const res = await apiFetch(
          `/api/scheduling/get_all_schedules_by_box_date?date=${dateOnly}&box=${selectedSpaceId}`
        );
        const data: any = await res?.json();

        setSpaceSchedules(
          Array.isArray(data)
            ? data[0].schedules
              ? data[0].schedules[dateOnly]
              : undefined
            : undefined
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchScheduling();
  }, [selectedDate, selectedSpaceId, simpleAction]);

  React.useEffect(() => {
    async function fetchBoxes() {
      try {
        const res = await apiFetch(`/api/scheduling/get_boxes`);
        const data: any = await res?.json();
        setAllSpaces(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchBoxes();
  }, []);

  const changeSelectedSpace = (idSpace: string) => {
    setSelectedSpace(allSpaces.find((s) => s.idBox === idSpace));
    setSelectedSpaceId(idSpace);
  };

  const dateKey = selectedDate?.toISOString().split("T")[0] || "";
  //const schedules = spaceSchedules?.schedules[dateKey] || [];

  // Pagination logic
  const totalPages = Math.ceil(spaceSchedules.length / PAGE_SIZE);
  const paginatedSchedules = spaceSchedules.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleCancelSchedule = (idAgendamiento: string) => {
    async function cancelSchedule(idAgendamiento: string) {
      try {
        await apiFetch(`/api/scheduling/cancel_schedule?id=${idAgendamiento}`);
        setSimpleAction(!simpleAction);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    cancelSchedule(idAgendamiento);
  };

  return (
    <div className="container mx-auto py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{`Selecciona un ${space}`}</CardTitle>
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
                {selectedSpaceId
                  ? `${spaceUpper} - ${
                      selectedSpace
                        ? selectedSpace.nombre
                          ? selectedSpace.nombre
                          : "N/A"
                        : "N/A"
                    }`
                  : `Elige un ${spaceLower}...`}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
              <Command>
                <CommandInput placeholder={`Buscar ${spaceLower}...`} />
                <CommandEmpty>{`No se encontró ${spaceLower}.`}</CommandEmpty>
                <CommandGroup
                  className="max-h-[150px]"
                  style={{ overflowY: "scroll" }}
                >
                  {allSpaces.map((curSpace, i) => (
                    <CommandItem
                      key={curSpace.idBox}
                      value={curSpace.nombre}
                      onSelect={() => {
                        changeSelectedSpace(curSpace.idBox);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          curSpace.idBox === selectedSpaceId
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {`${spaceUpper} - ${curSpace.nombre ?? `N/A - ${i}`}`}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {selectedSpace && (
        <Card>
          <CardHeader>
            <CardTitle>{`Calendario de ${space} - ${
              selectedSpace.nombre ? selectedSpace.nombre : "N/A"
            }`}</CardTitle>
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
                  {spaceSchedules.length > 0 ? (
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
                          {paginatedSchedules.map((sch: any, idx: any) => (
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
                                        <div>{`${space} - ${
                                          selectedSpace?.nombre
                                            ? selectedSpace.nombre
                                            : "N/A"
                                        }`}</div>
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
                                        <Button
                                          type="button"
                                          variant="default"
                                          onClick={
                                            sch.status === "Ocupado"
                                              ? (_) =>
                                                  handleCancelSchedule(
                                                    String(sch.idAgendamiento)
                                                  )
                                              : (_) => {}
                                          }
                                        >
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
