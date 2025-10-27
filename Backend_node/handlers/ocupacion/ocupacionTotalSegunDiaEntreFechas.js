import {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
} from "@aws-sdk/client-dynamodb";

import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

// Función para generar fechas entre rango
const generarFechas = (fecha1, fecha2) => {
  const fechas = [];
  let current = new Date(fecha1);
  const end = new Date(fecha2);
  while (current <= end) {
    fechas.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  return fechas;
};

export const main = async (event) => {
  try {
    const qs = event.queryStringParameters || {};
    const { fecha1, fecha2 } = qs;
    if (!fecha1 || !fecha2) {
      return { statusCode: 400, body: JSON.stringify({ error: "fecha1 y fecha2 requeridos" }) };
    }

    // Obtener total de boxes
    const boxesResult = await ddb.send(new ScanCommand({
      TableName: process.env.BOX_TABLE || "Box",
      ProjectionExpression: "idbox",
    }));
    const totalBoxes = boxesResult.Items.length;

    // Inicializar fechas
    const fechas = generarFechas(fecha1, fecha2);
    const fechasJson = {};
    fechas.forEach(f => fechasJson[f] = 0);

    // Obtener agendamientos entre fechas
    const agendamientosResult = await ddb.send(new ScanCommand({
      TableName: process.env.AGENDAMIENTOS_TABLE || "Agendamiento",
      FilterExpression: "#fecha BETWEEN :f1 AND :f2",
      ExpressionAttributeNames: { "#fecha": "fecha" },
      ExpressionAttributeValues: { ":f1": fecha1, ":f2": fecha2 },
      ProjectionExpression: "fecha, horaentrada, horasalida"
    }));

    // Calcular minutos ocupados por fecha
    agendamientosResult.Items.forEach(item => {
      const fecha = item.fecha;
      const [hEntrada, mEntrada] = item.horaentrada.split(":").map(Number);
      const [hSalida, mSalida] = item.horasalida.split(":").map(Number);
      const minutos = (hSalida - hEntrada) * 60 + (mSalida - mEntrada);
      fechasJson[fecha] = (fechasJson[fecha] || 0) + minutos;
    });

    // Dividir por minutos totales (930 * totalBoxes)
    fechas.forEach(f => {
      fechasJson[f] = fechasJson[f] / (930 * totalBoxes);
    });

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(fechasJson),
    };

  } catch (err) {
    console.error("Error en OcupacionTotalSegunDiaEntreFechas:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Error interno" }) };
  }
};
