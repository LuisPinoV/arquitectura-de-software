import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const apiUrl = process.env.BACKEND_ADDRESS;
  const incomingToken = req.headers.get("authorization") ?? "";

  const res = await fetch(`${apiUrl}/funcionario`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": incomingToken,   // <-- Forward it to backend
    },
  });
  const data = await res.json();

  // Defensive handling: ensure we have an array before mapping
  const source = Array.isArray(data) ? data : Array.isArray(data?.funcionarios) ? data.funcionarios : [];

  const personal = source.map((person: any) => {
    return { id: person["idfuncionario"], name: person["nombre"] };
  });

  return NextResponse.json(personal);
}
