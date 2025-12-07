import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/apiClient";

export async function GET(req: NextRequest) {
  const idAgendamiento : string | null = req.nextUrl.searchParams.get("id") || "-1";

  const apiUrl = process.env.BACKEND_ADDRESS;

  const incomingToken = req.headers.get("authorization") ?? "";

  const res = await apiFetch(`${apiUrl}/agendamiento/${idAgendamiento}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": incomingToken,   // <-- Forward it to backend
    },
  });
  const data = await res.json();

  return NextResponse.json(data);
}
