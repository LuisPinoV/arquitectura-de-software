import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  const apiUrl = process.env.BACKEND_ADDRESS;
  console.log(apiUrl);

  const res = await fetch(
    `${apiUrl}/box`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await res.json();

  const boxes = data.map((obj:any) => obj["idbox"]);

  return NextResponse.json({ boxes });
}
