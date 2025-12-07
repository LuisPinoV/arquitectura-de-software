import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const today = new Date();
  const date = today.toISOString().split("T")[0];
  const time = today.toISOString().split("T")[1].split(".")[0].slice(0,5);

  const apiUrl = process.env.BACKEND_ADDRESS;
  const incomingToken = req.headers.get("authorization") ?? "";

  // Fallback: determine free boxes by querying each box usage at current time
  const resAll = await fetch(`${apiUrl}/box`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": incomingToken,   // <-- Forward it to backend
    },
  });

  const dataAll = await resAll.json();

  let freeCount = 0;

  for (const b of dataAll) {
    const boxId = b["idBox"] ?? b["idbox"] ?? b["id"];
      try {
      const r = await fetch(`${apiUrl}/box/uso/${boxId}/${date}/${time}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": incomingToken,   // <-- Forward it to backend
        },
      });
      const d = await r.json();
      if (!d?.ocupado) freeCount++;
    } catch (err) {
      // ignore errors per-box
    }
  }

  return NextResponse.json({ free: freeCount, all: dataAll.length });
}
