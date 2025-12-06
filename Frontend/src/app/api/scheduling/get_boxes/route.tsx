import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  const apiUrl = process.env.BACKEND_ADDRESS;

  const res = await fetch(
    `${apiUrl}/box`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await res.json();

  // Defensive handling in case backend returns an object or wrapped response
  const source = Array.isArray(data) ? data : Array.isArray(data?.boxes) ? data.boxes : [];

  const boxes = source.map((obj: any) => obj["idbox"]);

  return NextResponse.json({ boxes });
}
