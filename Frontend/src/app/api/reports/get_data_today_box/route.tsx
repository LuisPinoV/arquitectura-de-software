import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const box = req.nextUrl.searchParams.get("idBox") || "0";

  const today = new Date();
  const todayDateISO = today.toISOString().split("T")[0];
  const todayTimeISO = today.toISOString().split("T")[1];

  const apiUrl = process.env.BACKEND_ADDRESS;
  const incomingToken = req.headers.get("authorization") ?? "";

  const res = await fetch(
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
