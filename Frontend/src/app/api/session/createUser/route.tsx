import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const apiUrl = process.env.BACKEND_ADDRESS;
    const incomingToken = request.headers.get("authorization") ?? "";

    const res = await fetch(`${apiUrl}/auth/createUser`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        "Authorization": incomingToken,   // <-- Forward it to backend
      },
    });

    const data = await res.json();

    return NextResponse.json({ ...data, ok: res.ok });
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid JSON", ok: false },
      { status: 400 }
    );
  }
}
