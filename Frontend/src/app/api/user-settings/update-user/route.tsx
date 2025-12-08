import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const apiUrl = process.env.BACKEND_ADDRESS;
    const incomingToken = request.headers.get("authorization") ?? "";

    const res = await fetch(`${apiUrl}/auth/updateUser`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        "Authorization": incomingToken,
      },
    });

    const data = await res.json();

    console.log(res);

    return NextResponse.json({ ...data, ok: res.ok });
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid JSON", ok: false },
      { status: 400 }
    );
  }
}