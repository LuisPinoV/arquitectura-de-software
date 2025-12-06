import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {

  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  const firstDate = req.nextUrl.searchParams.get('firstDate') || lastWeek.toISOString().split("T")[0];
  const lastDate = req.nextUrl.searchParams.get('lastDate') || today.toISOString().split("T")[0];

  const apiUrl = process.env.BACKEND_ADDRESS;

  const res = await fetch(`${apiUrl}/tomah/agendamientos-por-especialidad-rango-fechas/${firstDate}/${lastDate}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()

  if(!data)
  {
    return NextResponse.json({});
  }

  let total_scheduling = 0;
  for(let i = 0; i < data.length; i++)
  {
    total_scheduling += parseInt(data[i]["count"]);
  }

  let total_info = data.length > 5 ? 5: data.length;

  const final_data:any[] = [];

  for(let i = 0; i < total_info; i++)
  {
    final_data.push(
      {
        specialty: data[i]["especialidad"],
        percentage: ((parseInt(data[i]["count"]) / total_scheduling) * 100).toFixed(1),
      }
    );
  }
 
  return NextResponse.json(final_data);
}