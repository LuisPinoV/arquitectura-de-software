import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/apiClient";

export async function GET(req: NextRequest) {
  const today = new Date();
  const todayISO = today.toISOString().split("T")[0];

  const apiUrl = process.env.BACKEND_ADDRESS;
  const incomingToken = req.headers.get("authorization") ?? "";

  const res = await apiFetch(`${apiUrl}/agendamiento/fecha/${todayISO}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": incomingToken,   // <-- Forward it to backend
    },
  });
  const data = await res.json();

  const dataLength = Object.keys(data).length;
  
  return NextResponse.json({dataLength});
}
