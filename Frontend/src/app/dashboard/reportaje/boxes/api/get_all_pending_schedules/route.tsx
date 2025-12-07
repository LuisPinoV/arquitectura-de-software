import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  const apiUrl = process.env.BACKEND_ADDRESS;
  const incomingToken = req.headers.get("authorization") ?? "";

  const resAll = await fetch(`${apiUrl}/agendamiento`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": incomingToken,   // <-- Forward it to backend
    },
  });

  const dataAll = await resAll.json();

  const today = new Date();

  const dataAllLater = dataAll.filter((data: any) => {
    const dataDate = new Date(data["fecha"]);
    return dataDate >= today;
  });

  // Consider pending as any agendamiento that is not completed or canceled
  const pending = dataAllLater.filter((data: any) => {
    const estado = data["estado"] || data["Estado"] || null;
    return !estado || (estado !== "Completada" && estado !== "Cancelada");
  });

  return NextResponse.json({
    allCount: dataAllLater.length,
    pendingCount: pending.length,
  });
}
