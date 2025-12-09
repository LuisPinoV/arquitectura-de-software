import { NextResponse } from 'next/server';

export async function GET(req: Request) {

  const apiUrl = process.env.BACKEND_ADDRESS;
  const incomingToken = req.headers.get("authorization") ?? "";

  const res = await fetch(`${apiUrl}/box/especialidades`, {
    headers: {
      'Content-Type': 'application/json',
      "Authorization": incomingToken,
    },
  })
  const data = await res.json();

  if (!data) {
    return NextResponse.json({});
  }

  return NextResponse.json(data)
}