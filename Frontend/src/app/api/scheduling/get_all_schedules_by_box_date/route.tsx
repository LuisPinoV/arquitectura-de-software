import { NextRequest, NextResponse } from "next/server";

type Schedule = {
  time: string;
  status: "Libre" | "Ocupado";
  idAgendamiento: number;
};

type Box = {
  idBox: number;
  schedules: Record<string, Schedule[]>; // key = ISO date string
};

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  const box = req.nextUrl.searchParams.get("box");

  const today = new Date().toISOString().split("T")[0];

  if (box === null) {
    return NextResponse.json({});
  }

  const apiUrl = process.env.BACKEND_ADDRESS;

  const resSchedules = await fetch(`${apiUrl}/agendamientosFecha/${date}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const dataSchedules = await resSchedules.json();

  if(!dataSchedules)
  {
    return NextResponse.json({ error: "Couldn't get Schedules" }, { status: 500 });
  }

  const dataSchedulesArr = Object.values(dataSchedules);

  const dataBox: any = dataSchedulesArr.filter((data: any) => {
    const id = parseInt(data["idbox"]);

    if (id === parseInt(box)) {
      return data;
    }
  });

  const sortedData = dataBox.sort((dataA: any, dataB: any) => {
    const aDate = new Date(`${date ? date : today}T${dataA["horaentrada"]}Z`);
    const bDate = new Date(`${date ? date : today}T${dataB["horaentrada"]}Z`);

    return aDate.getTime() - bDate.getTime();
  });

  const possibleHours = Array.from({ length: 31 }).map((_, i) => {
    const hour = 8 + Math.floor(i / 2);
    const minutes = i % 2 === 0 ? "00" : "30";
    const time = `${String(hour).padStart(2, "0")}:${minutes}:00`;
    return { time };
  });

  const scheduleData: Schedule[] = possibleHours.map((hour: any) => {
    const boxData = sortedData.filter((boxData: any) => {
      if (hour.time === boxData["horaentrada"]) return boxData;
    });
    if (boxData.length > 0) {
      const curData = boxData[0];
      const curSchedule: Schedule = {
        time: `${curData["horaentrada"].split(":")[0]}:${
          curData["horaentrada"].split(":")[1]
        }`,
        status: "Ocupado",
        idAgendamiento: curData["idagendamiento"],
      };
      return curSchedule;
    } else {
      const curSchedule: Schedule = {
        time: `${hour.time.split(":")[0]}:${hour.time.split(":")[1]}`,
        status: "Libre",
        idAgendamiento: -1,
      };
      return curSchedule;
    }
  });
  const finalDate = date ? date : today;

  const finalData: Box = {
    idBox: parseInt(box),
    schedules: { [finalDate]: scheduleData },
  };

  return NextResponse.json([finalData]);
}
