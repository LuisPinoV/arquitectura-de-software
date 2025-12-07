import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const box = req.nextUrl.searchParams.get("idBox") || "0";

  const today = new Date();
  const todayDateISO = today.toISOString().split("T")[0];
  const todayTimeISO = today.toISOString().split("T")[1];

  const apiUrl = process.env.BACKEND_ADDRESS;

  const res = await fetch(
    `${apiUrl}/usoBox/${box}/${todayDateISO}/${todayTimeISO}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await res.json();

  return NextResponse.json(data);
}
