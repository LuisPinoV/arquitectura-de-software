import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/apiClient";

export async function GET(req: NextRequest) {
  const box = req.nextUrl.searchParams.get("idBox") || "0";
  const today = new Date();
  const apiUrl = process.env.BACKEND_ADDRESS;
  const incomingToken = req.headers.get("authorization") ?? "";

  const resSchedule = await apiFetch(`${apiUrl}/agendamiento`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": incomingToken,   // <-- Forward it to backend
    },
  });
  const data = await resSchedule.json();
  const resScheduleBox = data
    .filter((curData: any) => {
      const curDataDate = new Date(curData["fecha"]);
      const curDataBox = String(curData["idBox"] ?? curData["idbox"] ?? curData["box"]);

      return curDataBox === box && curDataDate >= today;
    })
    .map((curData: any) => {
      const curDataDate = new Date(curData["fecha"]);

      const hora = curData["horaEntrada"] ?? curData["horaentrada"] ?? curData["horaEntrada"];
      const time = hora ? `${hora.split(":")[0]}:${hora.split(":")[1]}` : "00:00";

      return {
        idAgendamiento: curData["idConsulta"] ?? curData["idConsulta"] ?? curData["idagendamiento"],
        date: curDataDate.toISOString().split("T")[0],
        time,
      };
    });

  return NextResponse.json(resScheduleBox);
}
