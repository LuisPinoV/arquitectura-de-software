import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/apiClient";

export async function GET(req: NextRequest) {
  const box = req.nextUrl.searchParams.get("idBox") || "0";

  const today = new Date();
  const todayDateISO = today.toISOString().split("T")[0];
  // use HH:MM format for time (backend expects hour:minute)
  const todayTimeISO = today.toISOString().split("T")[1].split(".")[0].slice(0,5);

  const apiUrl = process.env.BACKEND_ADDRESS;
  const incomingToken = req.headers.get("authorization") ?? "";

  const res = await apiFetch(
    `${apiUrl}/box/uso/${box}/${todayDateISO}/${todayTimeISO}`,
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": incomingToken,   // <-- Forward it to backend
      },
    }
  );
  const data = await res.json();

  return NextResponse.json(data);
}
