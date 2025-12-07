import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const idbox = req.nextUrl.searchParams.get("idBox") || "0";

  // Get current year
  const year = new Date().getFullYear();

  // Prepare one request per month
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const apiUrl = process.env.BACKEND_ADDRESS;
  // ⚡ Call your NestJS backend for each month/day
  const results = await Promise.all(
    months.map(async (month) => {
      // Pick a "representative" date (first of the month)
      const fecha = `${year}-${String(month).padStart(2, "0")}-01`;

      try {
        const res = await fetch(
          `${apiUrl}/usoBox/${idbox}/${fecha}/08:00`, // 🔹 adapt to your NestJS route
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error(`NestJS returned ${res.status}`);

        const data = await res.json();

        return {
          month: new Date(year, month - 1).toLocaleString("es-CL", {
            month: "long",
          }),
          ocupancia: data.ocupancia ?? 0,
        };
      } catch (err) {
        console.error(err);
        return {
          month: new Date(year, month - 1).toLocaleString("es-CL", {
            month: "long",
          }),
          ocupancia: 0,
        };
      }
    })
  );

  const finalResults = results.map((data:any) =>
    {
      return({month:data.month,
      ocupancia:parseInt((data.ocupancia * (30 * 31)).toFixed(0))})
    })


  return NextResponse.json(finalResults);
}
