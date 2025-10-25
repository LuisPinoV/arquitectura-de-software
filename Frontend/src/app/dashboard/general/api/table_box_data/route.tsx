import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const today = new Date().toISOString();

  const date = today.split("T")[0];
  const hour = today.split("T")[1];

  const apiUrl = process.env.BACKEND_ADDRESS;

  const res = await fetch(
    `${apiUrl}/tomah/query2/${date}/${hour}`,
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
    const status: any = values[i];
    if (status === undefined) continue;

    const usoPorcentual = (parseFloat(status["uso"]) * 100).toFixed(2);

    dataArr.push({
      numero: keys[i],
      enUso: status["libre"] ? "Libre" : "Ocupado",
      usoHoy: usoPorcentual + "%",
    });
  }

  const final_data = dataArr.slice(0, 9);

  return NextResponse.json({ final_data });
}
