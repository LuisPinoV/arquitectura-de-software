import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const apiUrl = process.env.BACKEND_ADDRESS || process.env.SERVER_BACKEND_ADDRESS;
  const incomingToken = req.headers.get("authorization") ?? "";

  const res = await fetch(`${apiUrl}/funcionario`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": incomingToken,   // <-- Forward it to backend
    },
  });
  const data = await res.json();

  console.log(data);

  const personal:any[] = Array.isArray(data) ? data.map((person: any) => {
    return { id: person.idFuncionario, name: person.nombre };
  }) : [];

  if(personal.length > 0)
  {
    personal.push({id:"01", name:"N/A"});
  }

  return NextResponse.json(personal.length != 0 ? personal : [{id:"01", name:"N/A"}]);
}
