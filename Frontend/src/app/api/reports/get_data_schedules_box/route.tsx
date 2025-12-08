import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const box = req.nextUrl.searchParams.get("idBox") || "0";
  const today = new Date();
  const apiUrl = process.env.BACKEND_ADDRESS;
  const incomingToken = req.headers.get("authorization") ?? "";

  const resSchedule = await fetch(`${apiUrl}/agendamiento`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": incomingToken,   // <-- Forward it to backend
    },
  });
  const data = await resSchedule.json();

  const resScheduleBox = data
  .filter((curData: any) => {
    const curDataDate = new Date(curData["fecha"]);
    const curDataBox = String(curData["idbox"]);

    return curDataBox === box && curDataDate >= today;
  })
  .map((curData: any) => {
    const curDataDate = new Date(curData["fecha"]);

    return {
      idAgendamiento: curData["idagendamiento"], // or some real ID field
      date: curDataDate.toISOString().split("T")[0],
      time: `${curData["horaentrada"].split(":")[0]}:${curData["horaentrada"].split(":")[1]}`
    };
  });

  return NextResponse.json(resScheduleBox);
}
