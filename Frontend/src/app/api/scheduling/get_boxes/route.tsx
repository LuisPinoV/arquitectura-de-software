import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const apiUrl = process.env.BACKEND_ADDRESS || process.env.SERVER_BACKEND_ADDRESS;

  // Read token from incoming request (from client using apiFetch)
  const incomingToken = req.headers.get("authorization") ?? "";

  const res = await fetch(`${apiUrl}/box`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": incomingToken,   // <-- Forward it to backend
    },
  });

  const data = await res.json();

  return NextResponse.json(Array.isArray(data) ? data : []);
}
