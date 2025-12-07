import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {

  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  const firstDate = req.nextUrl.searchParams.get('firstDate') || lastWeek.toISOString().split("T")[0];
  const lastDate = req.nextUrl.searchParams.get('lastDate') || today.toISOString().split("T")[0];

  const apiUrl = process.env.BACKEND_ADDRESS;
  const incomingToken = req.headers.get("authorization") ?? "";
  const res = await fetch(`${apiUrl}/agendamiento/estadisticas/especialidad/conteo-rango/${firstDate}/${lastDate}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": incomingToken,
    },
  })
  const data = await res.json()

  
  const total_scheduling = data.total;
  const conteo = data.conteo;

  const conteoPares = Object.entries(conteo);

  const total_info = conteoPares.length > 5 ? 5 : conteoPares.length;

  const final_data: any[] = [];

  for(let i = 0; i < total_info; i++)
  {
    const [especialidad, count] = conteoPares[i];
    final_data.push(
      {
        specialty: especialidad,
        percentage: ((count / total_scheduling) * 100).toFixed(1),
      }
    );
  }
 
  return NextResponse.json({ final_data })
}