import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {

  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  const firstDate = req.nextUrl.searchParams.get('firstDate') || lastWeek.toISOString().split("T")[0];
  const lastDate = req.nextUrl.searchParams.get('lastDate') || today.toISOString().split("T")[0];

  const apiUrl = process.env.BACKEND_ADDRESS;

  const incomingToken = req.headers.get("authorization") ?? "";

  const res = await fetch(`${apiUrl}/agendamiento/estadisticas/especialidad/ocupacion/${firstDate}/${lastDate}`, {
    headers: {
      'Content-Type': 'application/json',
      "Authorization": incomingToken,
    },
  })
  const data = await res.json()

  if (!data || !data.ocupacion) {
    return NextResponse.json([]);
  }

  const ocupacionArray = Object.entries(data.ocupacion).map(([specialty, info]: [string, any]) => ({
    specialty,
    percentage: info.porcentajeOcupacion
  }));

  ocupacionArray.sort((a, b) => b.percentage - a.percentage);

  const top5 = ocupacionArray.slice(0, 5).map(item => ({
    specialty: item.specialty,
    percentage: item.percentage.toFixed(1)
  }));

  return NextResponse.json(top5);
}