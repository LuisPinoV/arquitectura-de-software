import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const date: string | null = req.nextUrl.searchParams.get("date");
  const box = req.nextUrl.searchParams.get("box");

  const apiUrl = process.env.BACKEND_ADDRESS;
  const incomingToken = req.headers.get("authorization") ?? "";

  const res = await fetch(`${apiUrl}/box/disponibilidad/${box}/${date}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: incomingToken,
    },
  });

  const data = await res.json();

  if (!data) {
    return NextResponse.json([]);
  }

  //hour.split(":")[0].concat(":", hour.split(":")[1])
  const filtered_hours = Array.isArray(data.bloques)
    ? data.bloques
        .filter(
          (hour: { hora: string; disponible: boolean }) => hour.disponible
        )
        .map((hour: { hora: string; disponible: boolean }) => hour.hora)
    : [
        "08:00",
        "08:30",
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00",
        "20:30",
        "21:00",
        "21:30",
        "22:00",
        "22:30",
        "23:00",
        "23:30",
      ];

  return NextResponse.json(filtered_hours);
}
