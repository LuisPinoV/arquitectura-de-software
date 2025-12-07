// /app/api/agendamientos/route.ts
import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/apiClient";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idAgendamiento = searchParams.get("id");
    const state = searchParams.get("estado");

    const apiUrl = process.env.BACKEND_ADDRESS;

    if (!idAgendamiento || !state) {
      return NextResponse.json({ error: "Missing idBox or fecha" }, { status: 400 });
    }

    const incomingToken = request.headers.get("authorization") ?? "";

    const res = await apiFetch(`${apiUrl}/agendamiento/estado/${idAgendamiento}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": incomingToken,   // <-- Forward it to backend
      },
      body: JSON.stringify({ estado: state }),
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
