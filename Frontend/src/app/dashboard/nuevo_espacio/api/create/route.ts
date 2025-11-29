import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const apiUrl = process.env.BACKEND_ADDRESS;

    // Map frontend fields to backend expected shape
    const idBox = body.idBox || String(Date.now());
    const especialidad = body.category || body.spaceName || "SIN_ESPECIALIDAD";
    const pasillo = body.pasillo || "-";
    const capacidad = body.capacidad ? parseInt(String(body.capacidad)) : 1;

    const payload = {
      idBox,
      especialidad,
      pasillo,
      capacidad,
    };

    // Forward incoming Authorization header from the client (if present)
    const incomingAuth = request.headers.get('authorization') || request.headers.get('Authorization');

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (incomingAuth) headers['Authorization'] = incomingAuth;

    const res = await fetch(`${apiUrl}/box`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers,
    });

    const data = await res.json().catch(() => ({}));

    return NextResponse.json({ ...data, ok: res.ok }, { status: res.status });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Invalid JSON", ok: false }, { status: 400 });
  }
}
