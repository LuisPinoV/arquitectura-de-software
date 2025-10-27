import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const apiUrl = process.env.BACKEND_ADDRESS;

  const res = await fetch(`${apiUrl}/funcionario`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  const personal = data.map((person: any) => {
    return { id: person["idfuncionario"], name: person["nombre"] };
  });


  return NextResponse.json(personal);
}
