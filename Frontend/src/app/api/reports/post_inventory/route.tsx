import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const apiUrl = process.env.BACKEND_ADDRESS || process.env.SERVER_BACKEND_ADDRESS;
    const incomingToken = req.headers.get("authorization") ?? "";
  
    const box = req.nextUrl.searchParams.get("box") || "0";

    const res = await fetch(`${apiUrl}/box/${box}/inventario`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        "Authorization": incomingToken,
      },
    });

    const data = await res.json();

    if(!data)
      return NextResponse.json([]);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {error: "Invalid JSON", ok:false},
      {status: 400}
    );
  } 
}
