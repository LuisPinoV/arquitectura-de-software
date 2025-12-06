import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const date : string | null = req.nextUrl.searchParams.get("date");
  const box = req.nextUrl.searchParams.get("box");

  const apiUrl = process.env.BACKEND_ADDRESS;

  const res = await fetch(
    `${apiUrl}/horasDisponibles/${box}/${date}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await res.json();

  const filtered_hours = data.map((hour:string) => hour.split(":")[0].concat(":", hour.split(":")[1]));

  return NextResponse.json(filtered_hours);
}
