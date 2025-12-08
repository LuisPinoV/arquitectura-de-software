import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const apiUrl = process.env.BACKEND_ADDRESS;
  const incomingToken = req.headers.get("authorization") ?? "";

  const resAll = await fetch(`${apiUrl}/agendamiento/`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": incomingToken,   // <-- Forward it to backend
    },
  });

  const resPending = await fetch(
    `${apiUrl}/agendamientosPorConfirmar/`,
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": incomingToken,   // <-- Forward it to backend
      },
    }
  );

  const dataAll = await resAll.json();
  const dataPending = await resPending.json();

  const today = new Date();

  const dataAllLater = Array.isArray(dataAll)
    ? dataAll.filter((data: any) => {
        const dataDate = new Date(data["fecha"]);
        if (dataDate >= today) {
          return data;
        }
      })
    : [];

  const dataPendingLater = Array.isArray(dataPending)
    ? dataPending.filter((data: any) => {
        const dataDate = new Date(data["fecha"]);
        if (dataDate >= today) {
          return data;
        }
      })
    : [];

  return NextResponse.json({
    allCount: dataAllLater.length,
    pendingCount: dataPendingLater.length,
  });
}
