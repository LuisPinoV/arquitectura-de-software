"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";

type Request = {
  idAgendamiento: number;
  fecha: string; // ISO date
  hora: string;
  estado: "Aprobado" | "En revisión" | "Rechazado";
  solicitante: string;
};

type Box = {
  idBox: number;
  requests: Request[];
};

const PAGE_SIZE = 7;

export default function ScheduleRequestsPage({ box = null, date = new Date() }: { box?: string | null; date?: Date }) {
  const [open, setOpen] = React.useState(false);
  const [selectedBoxId, setSelectedBoxId] = React.useState<number | null>(box ? parseInt(box) : null);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date
  );
  const [page, setPage] = React.useState(1);
  const [allBoxes, setAllBoxes] = React.useState<string[]>([]);
  const [simpleAction, setSimpleAction] = React.useState<boolean>(true);
  const [boxes, setBoxes] = React.useState<Box[]>([]);

  React.useEffect(() => {
    setPage(1);
  }, [selectedBoxId, selectedDate]);

  // Fetch petitions from backend
  React.useEffect(() => {
    let fechaStr: string | null = null;
    if (selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
      fechaStr = selectedDate.toISOString().split("T")[0];
    }

    if (!selectedBoxId || !selectedDate) return;

    async function fetchRequests() {
      try {
        const res = await fetch(
          `/dashboard/agendamiento/api/get_all_petitions_per_box?idBox=${selectedBoxId}&fecha=${fechaStr}`
        );
        const json: any = await res.json();

        if (!selectedBoxId || !fechaStr) return; // ensure we have a valid number

        // Transform backend data to match Request type
        const requests: Request[] = (json.data || []).map((item: any) => ({
          idAgendamiento: item.idagendamiento,
          fecha: item.fecha.split("T")[0],
          hora: item.horaentrada,
          estado: item.estado as "Aprobado" | "En revisión" | "Rechazado",
          solicitante: `Paciente ${item.idpaciente}`,
        }));

        setBoxes([{ idBox: selectedBoxId, requests }]);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    }

    fetchRequests();
  }, [selectedBoxId, selectedDate, simpleAction]);

  // Fetch all boxes
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
  const requests = selectedBox?.requests || [];

  const totalPages = Math.ceil(requests.length / PAGE_SIZE);
  const paginatedRequests = requests.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleChangeEstado = (idAgendamiento: string, newEstado: string) => {
    async function changeEstado() {
      try {
        await fetch(
          `/dashboard/agendamiento/api/change_request_state?id=${idAgendamiento}&estado=${newEstado}`,
        );
        setSimpleAction(!simpleAction);
      } catch (error) {
        console.error("Error changing estado:", error);
      }
    }

    changeEstado();
  };

  return (
    <div className="container mx-auto py-10 space-y-6">
      {/* Box Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Selecciona un Box</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
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
                <CommandGroup
                  className="max-h-[150px]"
                  style={{ overflowY: "scroll" }}
                >
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

          {/* Date Selector */}
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      {/* Requests Table */}
      {selectedBox && (
        <Card>
          <CardHeader>
            <CardTitle>Solicitudes de {`BOX - ${selectedBox.idBox}`}</CardTitle>
          </CardHeader>
          <CardContent>
            {requests.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Hora</TableHead>
                      <TableHead>Solicitante</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRequests.map((req) => (
                      <TableRow key={req.idAgendamiento}>
                        <TableCell>{req.fecha}</TableCell>
                        <TableCell>{req.hora}</TableCell>
                        <TableCell>{req.solicitante}</TableCell>
                        <TableCell
                          className={
                            req.estado === "Aprobado"
                              ? "text-green-500"
                              : req.estado === "En revisión"
                              ? "text-yellow-500"
                              : "text-red-500"
                          }
                        >
                          {req.estado}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline">Cambiar estado</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>
                                  Cambiar estado de solicitud
                                </DialogTitle>
                              </DialogHeader>
                              <div className="flex flex-col gap-2">
                                <Button
                                  variant="default"
                                  onClick={() =>
                                    handleChangeEstado(
                                      String(req.idAgendamiento),
                                      "Aprobado"
                                    )
                                  }
                                >
                                  Aprobado
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    handleChangeEstado(
                                      String(req.idAgendamiento),
                                      "En revisión"
                                    )
                                  }
                                >
                                  En revisión
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    handleChangeEstado(
                                      String(req.idAgendamiento),
                                      "Rechazado"
                                    )
                                  }
                                >
                                  Rechazado
                                </Button>
                              </div>
                              <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                  <Button type="button" variant="secondary">
                                    Cerrar
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

                {/* Pagination */}
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
                No hay solicitudes para este box.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
