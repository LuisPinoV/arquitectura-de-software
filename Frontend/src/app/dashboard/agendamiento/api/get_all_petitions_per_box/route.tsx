// /app/api/agendamientos/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idBox = searchParams.get("idBox");
    const fecha = searchParams.get("fecha");

    const apiUrl = process.env.BACKEND_ADDRESS;

    if (!idBox || !fecha) {
      return NextResponse.json({ error: "Missing idBox or fecha" }, { status: 400 });
    }

    const incomingToken = request.headers.get("authorization") ?? "";

    const res = await fetch(`${apiUrl}/agendamientosPendientesBox/${idBox}/${fecha}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": incomingToken,   // <-- Forward it to backend
      },
    });

    if (!res.ok) {
      throw new Error(`Backend error: ${res.statusText}`);
    }

    const data = await res.json();

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Error in /api/agendamientos:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
