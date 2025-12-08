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
import { useEffect, useMemo, useState } from "react";
import { useUserProfile } from "@/hooks/use-user";
import { useLanguage } from "@/contexts/LanguageContext";
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

async function saveBooking(
  payload: {
    date: string;
    box: string;
    hours: string[];
    personal: string;
  },
  t: any
) {
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
  toast(t("scheduling.scheduleCreated"), {
    description: new Date().toLocaleString(),
    style: { color: "black" },
    action: {
      label: t("common.dismiss"),
      onClick: () => console.log("Dismiss"),
    },
  });
}

export function MainFormScheduling({
  box = null,
  newDate = new Date(),
  selectedHour = null,
}: {
  box?: string | null;
  newDate?: Date | undefined;
  selectedHour?: string | null;
}) {
  const { t } = useLanguage();
  const profile = useUserProfile() as any;
  const space = profile?.spaceName ?? "Box";
  const spaceUpper = space;
  const spaceLower = space.toLowerCase();
  const [date, setDate] = useState<Date | undefined>(newDate);
  const [selectedBox, setSelectedBox] = useState<string | null>(box);
  const [selectedHours, setSelectedHours] = useState<string[]>(
    selectedHour ? [selectedHour] : []
  );
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [spacesArray, setSpaces] = useState<any[]>([]);
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
    async function fetchSpaces() {
      try {
        const res = await apiFetch(`/api/scheduling/get_boxes`);
        if (!res) {
          console.error("No response from apiFetch for get_boxes");
          return;
        }
        const data: any = await res?.json();

        setSpaces(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchSpaces();
  }, []);

  let spaces = spacesArray;

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
          `/api/scheduling/get_available_times?box=${selectedBox}&date=${curDate}`
        );
        if (!res) {
          console.error("No response from apiFetch for get_available_times");
          return;
        }
        const data: any = await res?.json();
        setAvailableHours(Array.isArray(data) ? data : availableHours);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchAvailableHours();
  }, [selectedBox]);

  //BoxSearch
  if (searchBoxInput !== "") {
    spaces = spacesArray.filter((space) => {
      const boxArr = `${spaceUpper} - ${space.nombre}`;
      const input = searchBoxInput.toLowerCase();
      if (boxArr.toLowerCase().includes(input)) return space;
    });
  }

  //BoxPages

  const itemsPerPage = 10;
  const startIndex = (curPageBox - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, spaces.length);

  const visibleSpaces = spaces.slice(startIndex, endIndex);

  const totalPages = Math.ceil(spaces.length / itemsPerPage);

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
        const res = await apiFetch(`/api/scheduling/get_available_personal`);
        if (!res) {
          console.error("No response from apiFetch for get_available_personal");
          return;
        }
        const data: any = await res?.json();

        setPersonal(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchPersonal();
  }, []);

  const filteredPersonal = filterPersonal(personalArr, searchPersonalInput);
  const curPagePersonalArr = currentPagePersonal(
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
      toast(t("scheduling.missingRequirements"), {
        description: `${t("scheduling.pleaseSelect")} ${spaceLower}, ${t(
          "scheduling.staff"
        )} ${t("scheduling.and")} ${t("scheduling.atLeastOneHour")}`,
        action: {
          label: t("common.dismiss"),
          onClick: () => console.log("Dismiss"),
        },
      });
      return;
    }

    const payload = {
      date: date.toISOString().split("T")[0],
      box: selectedBox,
      hours: selectedHours,
      personal: selectedPersonal["id"],
    };

    await saveBooking(payload, t);

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
              <CardTitle>{t("scheduling.selectDate")}</CardTitle>
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
                <h2>
                  {t("scheduling.selectSpace").replace("space", spaceLower)}
                </h2>
              </CardTitle>
              <Input
                className="mt-2"
                placeholder={t("scheduling.searchSpace").replace(
                  "space",
                  spaceLower
                )}
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
                    {visibleSpaces.map((space, i) => (
                      <div
                        key={space.idBox ?? i}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <ToggleGroupItem
                          value={space.idBox}
                          className="m-2 flex-1"
                          data-orientation="vertical"
                        >
                          <div className="text-md font-semibold">{`${spaceUpper} - ${
                            space.nombre ?? "N/A"
                          }`}</div>
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
                <h2>{t("scheduling.selectTime")}</h2>
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
                <h2>{t("scheduling.selectStaff")}</h2>
              </CardTitle>
              <Input
                className="mt-2"
                placeholder={t("scheduling.searchStaff")}
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
              {t("common.confirm")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("scheduling.confirmBooking")}</DialogTitle>
              <DialogDescription>
                {t("scheduling.bookingDetails")}
              </DialogDescription>
            </DialogHeader>
            <div
              className="flex items-start gap-2"
              style={{ flexDirection: "column" }}
            >
              <div className="grid flex-1 gap-2">
                {t("scheduling.staff")} -{" "}
                {selectedPersonal
                  ? selectedPersonal["name"]
                  : t("common.unknown")}
              </div>
              <div className="grid flex-1 gap-2">
                {t("common.date")} -{" "}
                {date ? date.toLocaleDateString() : t("common.unknown")}
              </div>
              <div className="grid flex-1 gap-2">
                {t("scheduling.times")} -{" "}
                {selectedHours
                  ? selectedHours.map((hour) => `${hour} / `)
                  : t("common.unknown")}
              </div>
              <div className="grid flex-1 gap-2">
                {`${spaceUpper} - ${
                  selectedBox ? selectedBox : t("common.unknown")
                }`}
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary" className="mx-1">
                  {t("common.close")}
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="default"
                  className="mx-1"
                  onClick={handleAgendar}
                >
                  {t("common.accept")}
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

function filterPersonal(
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

function currentPagePersonal(
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
