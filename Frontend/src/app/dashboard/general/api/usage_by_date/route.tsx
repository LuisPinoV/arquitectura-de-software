import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/apiClient";

export async function GET(req: NextRequest) {
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  const firstDate =
    req.nextUrl.searchParams.get("firstDate") ||
    lastWeek.toISOString().split("T")[0];
  const lastDate =
    req.nextUrl.searchParams.get("lastDate") ||
    today.toISOString().split("T")[0];

  const apiUrl = process.env.BACKEND_ADDRESS;
  const incomingToken = req.headers.get("authorization") ?? "";

  const res = await apiFetch(
    `${apiUrl}/tomah/query1/${firstDate}/${lastDate}`,
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": incomingToken,   // <-- Forward it to backend
      },
    }
  );
  const data = await res.json();
  console.log(data);
  const keys = Object.keys(data);
  const values = Object.values(data);

  const dataArr:any[] = [];
  for(let i = 0; i < keys.length; i++)
  {
    dataArr.push({
        fecha:keys[i],
        uso:parseFloat(String(values[i])) * 100
    })
  }

  return NextResponse.json({ dataArr });
}
