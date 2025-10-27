import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const today = new Date().toISOString();

  const date = today.split("T")[0];
  const time = today.split("T")[1];

  const apiUrl = process.env.BACKEND_ADDRESS;
  
  const res = await fetch(
    `${apiUrl}/tomah/query4/${date}/${time}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await res.json();

  const keys = Object.keys(data);
  const values = Object.values(data);

  const dataArr: any[] = [];
  for (let i = 0; i < keys.length; i++) {
    const value: any = values[i];
    dataArr.push({
      box: keys[i],
      especialidad: value["especialidad"],
      estado: value["libre"] ? "Libre" : "Ocupado",
      ocupancia: (value["ocupancia"] * 100).toFixed(2),
    });
  }
  return NextResponse.json({ dataArr });
}
