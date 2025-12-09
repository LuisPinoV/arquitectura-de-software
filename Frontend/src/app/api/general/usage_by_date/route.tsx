import { NextRequest, NextResponse } from "next/server";

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

  const res = await fetch(
    `${apiUrl}/agendamiento/estadisticas/ocupacion-diaria/${firstDate}/${lastDate}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: incomingToken,
      },
    }
  );
  const data = await res.json();

  if (!data || !data.ocupacionPorDia) {
    return NextResponse.json([]);
  }

  const ocupacionPorDia = data.ocupacionPorDia;
  const dataArr: any[] = [];

  Object.entries(ocupacionPorDia).forEach(([fecha, info]: [string, any]) => {
    dataArr.push({
      fecha: fecha,
      uso: info.porcentajeOcupacion
    });
  });

  dataArr.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  return NextResponse.json(dataArr);
}
