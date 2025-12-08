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

  const startTime = startDateTime.toISOString().split("T")[1];
  const endTime = endDateTime.toISOString().split("T")[1];

  const apiUrl = process.env.BACKEND_ADDRESS;

  const incomingToken = req.headers.get("authorization") ?? "";

  const res = await fetch(
    `${apiUrl}/tomah/posteoPersonalizado/${box}/${funcionario}/${paciente}/${date}/${startTime}/${endTime}`,
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": incomingToken,   // <-- Forward it to backend
      },
    }
  );
  const data = await res.json();

  return NextResponse.json({ data });
}
