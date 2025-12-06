import { NextResponse } from 'next/server';

export async function GET() {

  const apiUrl = process.env.BACKEND_ADDRESS;

  const res = await fetch(`${apiUrl}/especialidadBox`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json();

  if(!data)
  {
    return NextResponse.json({});
  }
 
  return NextResponse.json(data)
}