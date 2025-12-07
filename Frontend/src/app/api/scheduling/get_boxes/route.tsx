import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const apiUrl = process.env.BACKEND_ADDRESS;

  // Read token from incoming request (from client using apiFetch)
  const incomingToken = req.headers.get("authorization") ?? "";

  const res = await fetch(`${apiUrl}/box`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": incomingToken,   // <-- Forward it to backend
    },
  });

  const data = await res.json();

  const source = Array.isArray(data)
    ? data
    : Array.isArray(data?.boxes)
    ? data.boxes
    : [];

  const boxes = source.map((obj: any) => obj["idBox"]);

  return NextResponse.json(boxes);
}
