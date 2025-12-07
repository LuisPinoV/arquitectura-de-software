import { NextRequest, NextResponse } from 'next/server';
import { apiFetch } from "@/lib/apiClient";

export async function GET(req: NextRequest) {

  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  const firstDate = req.nextUrl.searchParams.get('firstDate') || lastWeek.toISOString().split("T")[0];
  const lastDate = req.nextUrl.searchParams.get('lastDate') || today.toISOString().split("T")[0];

  const apiUrl = process.env.BACKEND_ADDRESS;
  const incomingToken = req.headers.get("authorization") ?? "";

  const res = await apiFetch(`${apiUrl}/agendamiento/estadisticas/especialidad/conteo-rango/${firstDate}/${lastDate}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': incomingToken,   // <-- Forward it to backend
    },
  })
  const data = await res.json()

  let total_scheduling = 0;
  for(let i = 0; i < data.length; i++)
  {
    total_scheduling += parseInt(data[i]["count"]);
  }

  let total_info = data.length > 5 ? 5: data.length;

  const final_data:any[] = [];

  for(let i = 0; i < total_info; i++)
  {
    final_data.push(
      {
        specialty: data[i]["especialidad"],
        percentage: ((parseInt(data[i]["count"]) / total_scheduling) * 100).toFixed(1),
      }
    );
  }
 
  return NextResponse.json({ final_data })
}