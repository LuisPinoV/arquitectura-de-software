import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const today = new Date();

  const date =
    req.nextUrl.searchParams.get("date") || today.toISOString().split("T")[0];
  const time =
    req.nextUrl.searchParams.get("time") || today.toISOString().split("T")[1];
  const box = req.nextUrl.searchParams.get("box") || "0";
  const paciente = "1";
  const funcionario = req.nextUrl.searchParams.get("funcionario") || "1";


  const startDateTime = new Date(`${date}T${time}Z`);
  const endDateTime = new Date(startDateTime);
  endDateTime.setMinutes(endDateTime.getMinutes() + 30);

  const startTime = startDateTime.toISOString().split("T")[1].split(".")[0].slice(0,5);
  const endTime = endDateTime.toISOString().split("T")[1].split(".")[0].slice(0,5);

  const apiUrl = process.env.BACKEND_ADDRESS;

  // Backend expects POST /agendamiento with JSON body
  const incomingToken = req.headers.get("authorization") ?? "";

  const res = await fetch(`${apiUrl}/agendamiento`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": incomingToken,   // <-- Forward it to backend
    },
    body: JSON.stringify({ idBox: box, idFuncionario: funcionario, idPaciente: paciente, fecha: date, horaEntrada: startTime, horaSalida: endTime }),
  });
  const data = await res.json();

  return NextResponse.json({ data });
}
