import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const idAgendamiento : string | null = req.nextUrl.searchParams.get("id") || "-1";

  const apiUrl = process.env.BACKEND_ADDRESS;

  const res = await fetch(
    `${apiUrl}/eliminarAgendamiento/${idAgendamiento}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await res.json();

  const response = data ?? {};

  return NextResponse.json(response);
}
