import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  const date =
    req.nextUrl.searchParams.get("date") ||
    new Date().toISOString().split("T")[0];
  const specialty =
    req.nextUrl.searchParams.get("specialty") || "medicinaGeneral";

  const apiUrl = process.env.BACKEND_ADDRESS;

  const res = await fetch(`${apiUrl}/tomah/query3/${specialty}/${date}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.text();

  if(!data)
  {
    return NextResponse.json({});
  }

  const value = parseFloat(data);
  const finalValue = Number.isNaN(value) ? 0 : value;

  return NextResponse.json({ number: Math.round(finalValue * 10000) / 100 });
}
