import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const today = new Date();
  const date = today.toISOString().split("T")[0];
  const time = today.toISOString().split("T")[1];

  const apiUrl = process.env.BACKEND_ADDRESS;

  const res = await fetch(
    `${apiUrl}/boxesLibres/${date}/${time}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await res.json();

  const resAll = await fetch(
    `${apiUrl}/box`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const dataAll = await resAll.json();

  return NextResponse.json({ free:data.length, all:dataAll.length });
}
