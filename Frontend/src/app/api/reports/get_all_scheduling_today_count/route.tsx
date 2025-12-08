import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const today = new Date();
  const todayISO = today.toISOString().split("T")[0];

  const apiUrl = process.env.BACKEND_ADDRESS;
  const incomingToken = req.headers.get("authorization") ?? "";

  const res = await fetch(
    `${apiUrl}/agendamientosFecha/${todayISO}`,
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": incomingToken,   // <-- Forward it to backend
      },
    }
  );
  const data = await res.json();

  const dataLength = data ? Object.keys(data).length : 0;
  
  return NextResponse.json(dataLength);
}
