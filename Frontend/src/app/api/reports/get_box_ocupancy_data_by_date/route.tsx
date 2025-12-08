import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const idBox = searchParams.get("idBox") || "0";
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: "Missing startDate or endDate" },
      { status: 400 }
    );
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  // build array of dates between start and end
  const dates: string[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split("T")[0]); // YYYY-MM-DD
  }

  const apiUrl = process.env.BACKEND_ADDRESS;
  const incomingToken = req.headers.get("authorization") ?? "";

  // fetch data for each date from your NestJS backend
  const results = await Promise.all(
    dates.map(async (date) => {
      const res = await fetch(
        `${apiUrl}/usoBox/${idBox}/${date}/08:00:00`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": incomingToken,   // <-- Forward it to backend
          },
        }
      );
      const data = await res.json();
      return {
        date,
        ocupancia: data.ocupancia, // from your usoBox() return
      };
    })
  );

  console.log(results);

  return NextResponse.json(results);
}

