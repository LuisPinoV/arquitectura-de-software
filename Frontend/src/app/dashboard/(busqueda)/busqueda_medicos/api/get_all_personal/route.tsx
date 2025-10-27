import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  const apiUrl = process.env.BACKEND_ADDRESS;
  
  const res = await fetch(
    `${apiUrl}/funcionarioFull/`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await res.json();
  
  return NextResponse.json(data);
}
