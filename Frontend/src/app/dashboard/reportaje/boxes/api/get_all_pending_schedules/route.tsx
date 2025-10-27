import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  const apiUrl = process.env.BACKEND_ADDRESS;

  const resAll = await fetch(`${apiUrl}/agendamiento/`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const resPending = await fetch(
    `${apiUrl}/agendamientosPorConfirmar/`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const dataAll = await resAll.json();
  const dataPending = await resPending.json();

  const today = new Date();

  const dataAllLater = dataAll.filter((data: any) => {
    const dataDate = new Date(data["fecha"]);
    if (dataDate >= today) {
      return data;
    }
  });

  const dataPendingLater = dataPending.filter((data: any) => {
    const dataDate = new Date(data["fecha"]);
    if (dataDate >= today) {
      return data;
    }
  });

  return NextResponse.json({
    allCount: dataAllLater.length,
    pendingCount: dataPendingLater.length,
  });
}
