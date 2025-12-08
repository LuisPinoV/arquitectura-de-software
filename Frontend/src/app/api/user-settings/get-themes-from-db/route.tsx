import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  const apiUrl = process.env.BACKEND_ADDRESS || process.env.SERVER_BACKEND_ADDRESS;

  const incomingToken = req.headers.get("authorization") ?? "";

  const id = req.nextUrl.searchParams.get("id");

  const res = await fetch(
    `${apiUrl}/profile/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": incomingToken,
      },
    }
  );
  const data = await res.json();

  const response = Array.isArray(data) ? data : [];

  return NextResponse.json(response);
}
