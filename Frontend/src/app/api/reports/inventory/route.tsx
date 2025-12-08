import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const apiUrl = process.env.BACKEND_ADDRESS || process.env.SERVER_BACKEND_ADDRESS;
  const incomingToken = req.headers.get("authorization") ?? "";

  const box = req.nextUrl.searchParams.get("box") || "0";

  const res = await fetch(`${apiUrl}/box/${box}/inventario`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": incomingToken,
    },
  });

  const data = await res.json();

  if(!data)
    return NextResponse.json([]);

  return NextResponse.json(data);
}
