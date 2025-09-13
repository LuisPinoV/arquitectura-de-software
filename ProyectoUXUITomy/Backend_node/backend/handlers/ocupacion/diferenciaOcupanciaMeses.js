// handlers/reportes/diferenciaOcupanciaMeses.js
import { ddb, commands } from "../_lib/dynamo.js";

const meses30 = ["04", "06", "09", "11"]; // Abril, Junio, Septiembre, Noviembre

const calcularRangoMes = (mes) => {
  const [year, mm] = mes.split("-");
  let dias = 31;
  if (mm === "02") dias = 28;
  else if (meses30.includes(mm)) dias = 30;

  const min = `${year}-${mm}-01`;
  const max = `${year}-${mm}-${dias.toString().padStart(2, "0")}`;
  return { min, max, dias };
};

export const main = async (event) => {
  try {
    const qs = event.queryStringParameters || {};
    const { mes1, mes2 } = qs;
    if (!mes1 || !mes2) {
      return { statusCode: 400, body: JSON.stringify({ error: "mes1 y mes2 requeridos" }) };
    }

    const { min: mes1Min, max: mes1Max, dias: dias1 } = calcularRangoMes(mes1);
    const { min: mes2Min, max: mes2Max, dias: dias2 } = calcularRangoMes(mes2);

    // 1️⃣ Contar total de boxes
    const boxesResult = await ddb.send(new commands.ScanCommand({
      TableName: process.env.BOX_TABLE || "Box",
      ProjectionExpression: "idbox",
    }));
    const totalBoxes = boxesResult.Items.length;

    // 2️⃣ Contar agendamientos mes1
    const agendamientosMes1 = await ddb.send(new commands.ScanCommand({
      TableName: process.env.AGENDAMIENTOS_TABLE || "Agendamiento",
      FilterExpression: "#fecha BETWEEN :min AND :max",
      ExpressionAttributeNames: { "#fecha": "fecha" },
      ExpressionAttributeValues: { ":min": mes1Min, ":max": mes1Max },
      Select: "COUNT",
    }));

    // 3️⃣ Contar agendamientos mes2
    const agendamientosMes2 = await ddb.send(new commands.ScanCommand({
      TableName: process.env.AGENDAMIENTOS_TABLE || "Agendamiento",
      FilterExpression: "#fecha BETWEEN :min AND :max",
      ExpressionAttributeNames: { "#fecha": "fecha" },
      ExpressionAttributeValues: { ":min": mes2Min, ":max": mes2Max },
      Select: "COUNT",
    }));

    const countMes1 = agendamientosMes1.Count || 0;
    const countMes2 = agendamientosMes2.Count || 0;

    // 4️⃣ Calcular diferencia de ocupación
    const porcentajeMes1 = (countMes1 * 30) / (930 * dias1 * totalBoxes);
    const porcentajeMes2 = (countMes2 * 30) / (930 * dias2 * totalBoxes);
    const diferencia = porcentajeMes2 - porcentajeMes1;

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ diferencia }),
    };

  } catch (err) {
    console.error("Error en diferenciaOcupanciaMeses:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Error interno" }) };
  }
};
