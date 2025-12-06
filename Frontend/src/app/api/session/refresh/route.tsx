import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const apiUrl = process.env.BACKEND_ADDRESS;

    const res = await fetch(`${apiUrl}/auth/refresh`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(res);

    const data = await res.json();


    return NextResponse.json({...data, ok: res.ok});
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON", ok: false }, { status: 400 });
  }
}
