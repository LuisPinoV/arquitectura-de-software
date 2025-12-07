import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const today = new Date();
  const date = today.toISOString().split("T")[0];
  const time = today.toISOString().split("T")[1];

  const apiUrl = process.env.BACKEND_ADDRESS;
  const incomingToken = req.headers.get("authorization") ?? "";

  const res = await fetch(
    `${apiUrl}/boxesLibres/${date}/${time}`,
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": incomingToken,   // <-- Forward it to backend
      },
    }
  );

  const data = await res.json();

  const resAll = await fetch(
    `${apiUrl}/box`,
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": incomingToken,   // <-- Forward it to backend
      },
    }
  );

  const dataAll = await resAll.json();

  return NextResponse.json({ free:data.length, all:dataAll.length });
}
