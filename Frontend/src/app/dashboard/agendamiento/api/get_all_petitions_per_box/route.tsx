// /app/api/agendamientos/route.ts
import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/apiClient";

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

    const res = await apiFetch(`${apiUrl}/agendamiento/box/${idBox}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": incomingToken,   // <-- Forward it to backend
      },
    });
    if (!res.ok) throw new Error(`Backend error: ${res.statusText}`);
    const all = await res.json();

    // filter by date and pending state
    const filtered = (all || []).filter((a: any) => {
      const sameDate = (a.fecha || a["fecha"]) === fecha;
      const estado = a.estado || a["estado"] || null;
      const pending = !estado || (estado !== "Completada" && estado !== "Cancelada");
      return sameDate && pending;
    });

    return NextResponse.json(filtered);
  } catch (error: any) {
    console.error("Error in /api/agendamientos:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
