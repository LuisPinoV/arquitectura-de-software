import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const apiUrl = process.env.BACKEND_ADDRESS;

    const res = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    const didWorked = data.error == undefined ? true : false;

    return NextResponse.json({...data, ok: didWorked});
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON", ok: false }, { status: 400 });
  }
}
