import { NextRequest, NextResponse } from "next/server";
import { Box } from "../../components/table-boxes";

export async function GET(req: NextRequest) {

    const today = new Date();
    const todayDateISO = today.toISOString().split("T")[0];
    const todayTimeISO = today.toISOString().split("T")[1];

    const apiUrl = process.env.BACKEND_ADDRESS;

  const incomingToken = req.headers.get("authorization") ?? "";

  const resAll = await fetch(
    `${apiUrl}/box`,
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": incomingToken,   // <-- Forward it to backend
      },
    }
  );

  const dataAll = await resAll.json();

  const dataBoxes:Box[] = [];


  for(let i = 0; i < dataAll.length; i++)
  {
    const resPerBox = await fetch(
    `${apiUrl}/usoBox/${dataAll[i]["idbox"]}/${todayDateISO}/${todayTimeISO}`,
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": incomingToken,   // <-- Forward it to backend
      },
    }
  );
    const dataPerBox = await resPerBox.json();

    dataBoxes.push({
        id: dataPerBox["id"],
        state:dataPerBox["libre"] ? "Libre" : "Ocupado",
        usage: parseFloat(dataPerBox["ocupancia"].toFixed(1)) * 100
    })

  }

  
  return NextResponse.json(dataBoxes);
}
