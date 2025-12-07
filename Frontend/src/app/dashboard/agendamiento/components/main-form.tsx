"use client";

import { Col, Row } from "antd";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect, useMemo, useState } from "react";
import { useUserProfile } from '@/hooks/use-user';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { es } from "react-day-picker/locale";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { apiFetch } from "@/lib/apiClient";

async function saveBooking(payload: {
  date: string;
  box: string;
  hours: string[];
  personal:string;
}) {
  for (let i = 0; i < payload["hours"].length; i++) {
    const hour = payload["hours"][i];
    try {
      await apiFetch(
        `/dashboard/agendamiento/api/schedule?date=${payload["date"]}&time=${hour}&box=${payload["box"]}&funcionario=${payload["personal"]}`
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  toast("Horario creado", {
    description: new Date().toLocaleString(),
    style: { color: "black" },
    action: {
      label: "Descartar",
      onClick: () => console.log("Descartar"),
    },
  });
}

export function MainFormScheduling({ box = null, newDate = new Date(),  selectedHour = null}: { box?: string | null; newDate?: Date |undefined, selectedHour?: string |null }) {
  const profile = useUserProfile() as any;
  const space = profile?.spaceName ?? 'Box';
  const spaceUpper = space.toUpperCase();
  const spaceLower = space.toLowerCase();
  const [date, setDate] = useState<Date | undefined>(newDate);
  const [selectedBox, setSelectedBox] = useState<string | null>(box);
  const [selectedHours, setSelectedHours] = useState<string[]>(selectedHour ? [selectedHour] : []);
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [boxesArr, setBoxes] = useState<string[]>([]);
  const [searchBoxInput, setSearchBoxInput] = useState<string>("");
  const [curPageBox, setCurPageBoxes] = useState<number>(1);
  const [personalArr, setPersonal] = useState<{ name: string; id: string }[]>(
    []
  );
  const [curPagePersonal, setCurPagePersonal] = useState<number>(1);
  const [searchPersonalInput, setSearchPersonalInput] = useState<string>("");
  const [selectedPersonal, setSelectedPersonal] = useState<{
    name: string;
    id: string;
  }>();
  const [confirmButtonVariant, setConfirmButtonDisabled] =
    useState<boolean>(true);

  useEffect(() => {
    async function fetchBoxes() {
      try {
        const res = await apiFetch(`/dashboard/agendamiento/api/get_boxes`);
        if (!res) {
          console.error("No response from apiFetch for get_boxes");
          return;
        }
        const data: any = await res.json();
        setBoxes(data["boxes"]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchBoxes();
  }, []);

  let boxes = boxesArr;

  const timeSlots = useMemo(
    () =>
      Array.from({ length: 31 }, (_, i) => {
        const totalMinutes = i * 30;
        const hour = Math.floor(totalMinutes / 60) + 8;
        const minute = totalMinutes % 60;
        return `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
      }),
    []
  );

  //DataChange
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    setSelectedBox(null);
    setSelectedHours([]);
    setAvailableHours([]);
    setSelectedPersonal(undefined);
    setConfirmButtonDisabled(true);
  };

  const handleBoxChange = (value: string) => {
    if (!value) {
      setSelectedBox(null);
      setSelectedHours([]);
      setAvailableHours([]);
      setSelectedPersonal(undefined);
      setConfirmButtonDisabled(true);
      return;
    }
    setSelectedBox(value);
    setSelectedHours([]);
  };

  const handleSearchBoxChange = (value: string) => {
    setSearchBoxInput(value);

    const firstPage = 1;
    setCurPageBoxes(firstPage);
  };

  //Get Available Hours
  useEffect(() => {
    async function fetchAvailableHours() {
      if (selectedBox === null || date === undefined) return;

      try {
        const curDate = date.toISOString().split("T")[0];
        const res = await apiFetch(
          `/dashboard/agendamiento/api/get_available_times?box=${selectedBox}&date=${curDate}`
        );
        if (!res) {
          console.error("No response from apiFetch for get_available_times");
          return;
        }
        const data: any = await res.json();
        setAvailableHours(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchAvailableHours();
  }, [selectedBox]);

  //BoxSearch
  if (searchBoxInput !== "") {
    boxes = boxesArr.filter((box) => {
      const boxArr = `${spaceUpper} - ${box}`;
      const input = searchBoxInput.toLowerCase();
      if (boxArr.toLowerCase().includes(input)) return box;
    });
  }

  //BoxPages

  const itemsPerPage = 10;
  const startIndex = (curPageBox - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, boxes.length);

  const visibleBoxes = boxes.slice(startIndex, endIndex);

  const totalPages = Math.ceil(boxes.length / itemsPerPage);

  //Calendar
  const startDate = new Date();

  const endDate = new Date(startDate);
  const yearsToShow = 2;
  endDate.setFullYear(startDate.getFullYear() + yearsToShow);

  if (endDate.getDay() < 6) {
    const days = 6;
    const remainingWeekDays = days - endDate.getDay();

    endDate.setDate(endDate.getDate() + remainingWeekDays);
  }

  const unavailableDates = Array.from(
    { length: startDate.getDate() },
    (_, i) => new Date(startDate.getFullYear(), startDate.getMonth(), i)
  );

  const handleNextBoxes = () => {
    if (curPageBox < totalPages) {
      setCurPageBoxes(curPageBox + 1);
    }
  };

  const handlePrevBoxes = () => {
    if (curPageBox > 1) {
      setCurPageBoxes(curPageBox - 1);
    }
  };

  //PersonalPagesAndFilter
  useEffect(() => {
    async function fetchPersonal() {
      try {
        const res = await apiFetch(
          `/dashboard/agendamiento/api/get_available_personal`
        );
        if (!res) {
          console.error("No response from apiFetch for get_available_personal");
          return;
        }
        const data: any = await res.json();
        setPersonal(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchPersonal();
  }, []);

  const filteredPersonal = FilterPersonal(personalArr, searchPersonalInput);
  const curPagePersonalArr = CurrentPagePersonal(
    filteredPersonal,
    curPagePersonal
  );

  const totalPagesPersonal = curPagePersonalArr ? curPagePersonalArr[1] : 1;

  const handleNextPersonal = () => {
    if (curPagePersonal < totalPagesPersonal) {
      setCurPagePersonal(curPagePersonal + 1);
    }
  };

  const handlePrevPersonal = () => {
    if (curPagePersonal > 1) {
      setCurPagePersonal(curPagePersonal - 1);
    }
  };

  const handlePersonalChange = (value: string) => {
    const selected = personalArr.filter((data) => {
      const curId = parseInt(data["id"]);
      if (curId === parseInt(value)) return data;
    });

    setSelectedPersonal(selected[0]);

    if (
      !date ||
      !selectedBox ||
      selectedHours.length === 0 ||
      value === undefined ||
      value === ""
    ) {
      setConfirmButtonDisabled(true);
    } else {
      setConfirmButtonDisabled(false);
    }
  };

  const handleSearchPersonalChange = (value: string) => {
    setSearchPersonalInput(value);

    const firstPage = 1;
    setCurPagePersonal(firstPage);
  };

  const handleChangeSelectedHours = (value: string[]) => {
    setSelectedHours(value);

    if (value.length === 0 || value === undefined) {
      setSelectedPersonal(undefined);
      setConfirmButtonDisabled(true);
    }

    if (!date || !selectedBox || value.length === 0 || !selectedPersonal) {
      setConfirmButtonDisabled(true);
    } else {
      setConfirmButtonDisabled(false);
    }
  };

  const handleAgendar = async () => {
    if (
      !date ||
      !selectedBox ||
      selectedHours.length === 0 ||
      !selectedPersonal
    ) {
      toast("Faltan requerimientos", {
        description:
          `Por favor selecciona fecha, ${spaceLower}, funcionario y al menos un horario.`,
        action: {
          label: "Descartar",
          onClick: () => console.log("Descartar"),
        },
      });
      return;
    }

    const payload = {
      date: date.toISOString().split("T")[0],
      box: selectedBox,
      hours: selectedHours,
      personal: selectedPersonal["id"]
    };

    await saveBooking(payload);

    handleDateChange(undefined);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Formulario de agendamiento</CardTitle>
      </CardHeader>
      <Row align="middle" justify="center" style={{ marginTop: "40px" }}>
        <Col
          xxl={6}
          xl={8}
          lg={16}
          md={24}
          sm={24}
          xs={24}
          style={{
            margin: "10px 15px",
            padding: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Card
            className="max-w-[500px] h-[400px] sm:h-[550px]"
            style={{
              display: "flex",
              flexDirection: "column",
              paddingLeft: "10px",
              paddingRight: "10px",
            }}
          >
            <CardHeader style={{ minWidth: "200px" }}>
              <CardTitle>Elige una fecha disponible</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="flex flex-col gap-1 p-0 m-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && handleDateChange(d)}
                  className="[&_[role=gridcell]]:max-w-[30px] sm:[&_[role=gridcell]]:max-w-[52px] rounded-lg border [--cell-size:--spacing(8)] sm:[--cell-size:--spacing(12)] md:[--cell-size:--spacing(12)] xl:[--cell-size:--spacing(13)]"
                  locale={es}
                  defaultMonth={date}
                  buttonVariant="ghost"
                  startMonth={startDate}
                  endMonth={endDate}
                  disabled={unavailableDates}
                  showOutsideDays={true}
                />
              </div>
            </CardContent>
          </Card>
        </Col>
        <Col
          xxl={4}
          xl={5}
          lg={10}
          md={12}
          sm={12}
          xs={18}
          style={{ margin: "10px 0px" }}
        >
          <Card className="max-w-[450px] h-[550px]">
            <CardHeader>
              <CardTitle>
                <h2>{`Elige una ${spaceLower}`}</h2>
              </CardTitle>
              <Input
                className="mt-2"
                placeholder={`Buscar ${spaceLower}...`}
                onChange={(e) => handleSearchBoxChange(e.target.value)}
              />
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-85 flex-1 ">
                <div className="p-1">
                  <ToggleGroup
                    variant="outline"
                    type="single"
                    orientation="vertical"
                    value={selectedBox ?? ""}
                    onValueChange={handleBoxChange}
                    asChild
                  >
                    {visibleBoxes.map((box) => (
                      <div
                        key={box}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <ToggleGroupItem
                          value={box}
                          className="m-2 flex-1"
                          data-orientation="vertical"
                        >
                          <div className="text-md font-semibold">{`${spaceUpper} - ${box}`}</div>
                        </ToggleGroupItem>
                      </div>
                    ))}
                  </ToggleGroup>
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={handlePrevBoxes} />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink>{curPageBox}</PaginationLink>
                  </PaginationItem>
                  <PaginationItem></PaginationItem>
                  <PaginationItem>
                    <PaginationNext onClick={handleNextBoxes} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          </Card>
        </Col>
        <Col
          xxl={4}
          xl={4}
          lg={10}
          md={12}
          sm={12}
          xs={18}
          style={{ margin: "10px 10px" }}
        >
          <Card className="max-w-[450px] h-[550px]">
            <CardHeader>
              <CardTitle>
                <h2>Elige uno o más horarios disponible</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-100 flex-1 ">
                <div className="p-1">
                  <ToggleGroup
                    variant="outline"
                    type="multiple"
                    orientation="vertical"
                    value={selectedHours}
                    onValueChange={handleChangeSelectedHours}
                    asChild
                  >
                    {timeSlots.map((time) => (
                      <div
                        key={time}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <ToggleGroupItem
                          value={time}
                          className="m-2 flex-1"
                          disabled={!availableHours.includes(time)}
                        >
                          {availableHours.includes(time) ? (
                            <div className="text-md font-semibold">{time}</div>
                          ) : (
                            <div className="text-md font-semibold line-through opacity-100">
                              {time}
                            </div>
                          )}
                        </ToggleGroupItem>
                      </div>
                    ))}
                  </ToggleGroup>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </Col>
        <Col
          xxl={4}
          xl={5}
          lg={10}
          md={12}
          sm={12}
          xs={18}
          style={{ margin: "10px 0px" }}
        >
          <Card className="max-w-[450px] h-[550px]">
            <CardHeader>
              <CardTitle>
                <h2>Elige un funcionario/a</h2>
              </CardTitle>
              <Input
                className="mt-2"
                placeholder="Buscar personal..."
                onChange={(e) => handleSearchPersonalChange(e.target.value)}
              />
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-85 flex-1 ">
                <div className="p-1">
                  <ToggleGroup
                    variant="outline"
                    type="single"
                    orientation="vertical"
                    value={selectedPersonal?.id ?? ""}
                    onValueChange={handlePersonalChange}
                    asChild
                  >
                    {curPagePersonalArr[0].map((person) => (
                      <div
                        key={person["id"]}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <ToggleGroupItem
                          value={person["id"]}
                          className="m-2 flex-1"
                          data-orientation="vertical"
                        >
                          <div className="text-md font-semibold">
                            {person["name"]}
                          </div>
                        </ToggleGroupItem>
                      </div>
                    ))}
                  </ToggleGroup>
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={handlePrevPersonal} />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink>{curPagePersonal}</PaginationLink>
                  </PaginationItem>
                  <PaginationItem></PaginationItem>
                  <PaginationItem>
                    <PaginationNext onClick={handleNextPersonal} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          </Card>
        </Col>
      </Row>
      <CardFooter
        className="w-100"
        style={{ display: "flex", justifyContent: "right", width: "100%" }}
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button className="min-w-[150px]" disabled={confirmButtonVariant}>
              Confirmar
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>¿Desea confirmar?</DialogTitle>
              <DialogDescription>
                Estos son los datos entregados
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-start gap-2" style = {{flexDirection:"column"}}>
              <div className="grid flex-1 gap-2">
                Funcionario - {selectedPersonal ? selectedPersonal["name"] : "Desconocido"}
              </div>
              <div className="grid flex-1 gap-2">
                Fecha - {date ? date.toLocaleDateString() : "Desconocido"}
              </div>
              <div className="grid flex-1 gap-2">
                Horas - {selectedHours ? selectedHours.map((hour) => `${hour} / `) : "Desconocido"}
              </div>
              <div className="grid flex-1 gap-2">
                {`${spaceUpper} - ${selectedBox ? selectedBox : "Desconocido"}`}
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary" className="mx-1">
                  Cerrar
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="default"
                  className="mx-1"
                  onClick={handleAgendar}
                >
                  Aceptar
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

function FilterPersonal(
  data: { name: string; id: string }[],
  searchInput: string
): { name: string; id: string }[] {
  const filteredPersonalData: { name: string; id: string }[] = data.filter(
    (personal) => {
      const personalName = personal["name"].toLowerCase();
      if (personalName.includes(searchInput)) return personal;
    }
  );

  return filteredPersonalData;
}

function CurrentPagePersonal(
  data: { name: string; id: string }[],
  curPage: number
): [{ name: string; id: string }[], number] {
  const itemsPerPage = 10;
  const startIndex = (curPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);

  const visiblePersonal = data.slice(startIndex, endIndex);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  return [visiblePersonal, totalPages];
}
