import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/apiClient";

export async function GET(req: NextRequest) {
  const date : string | null = req.nextUrl.searchParams.get("date");
  const box = req.nextUrl.searchParams.get("box");

  const apiUrl = process.env.BACKEND_ADDRESS;

  // Backend doesn't expose a direct horasDisponibles endpoint.
  // Fetch agendamientos for the box and compute free slots client-side.
  const incomingToken = req.headers.get("authorization") ?? "";

  const res = await apiFetch(`${apiUrl}/agendamiento/box/${box}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": incomingToken,   // <-- Forward it to backend
    },
  });
  const all = await res.json();

  const booked = (all || [])
    .filter((a: any) => (a.fecha || a["fecha"]) === date)
    .map((a: any) => (a.horaEntrada ?? a["horaentrada"] ?? "00:00"));

  const HORAS = [
    '08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
    '12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30',
    '16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30',
    '20:00','20:30','21:00','21:30','22:00','22:30','23:00','23:30'
  ];

  const filtered_hours = HORAS.filter(h => !booked.includes(h));

  return NextResponse.json(filtered_hours);
}
