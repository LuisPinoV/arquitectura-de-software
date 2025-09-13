import { ddb, commands } from "../_lib/dynamo.js";

export const main = async (event) => {
  try {
    const qs = event.queryStringParameters || {};
    const { idbox, fecha } = qs;

    if (!idbox || !fecha) {
      return { statusCode: 400, body: JSON.stringify({ error: "idbox y fecha requeridos" }) };
    }

    const result = await ddb.send(new commands.ScanCommand({
      TableName: process.env.AGENDAMIENTOS_TABLE || "Agendamiento",
      FilterExpression: "#idbox = :idbox AND #fecha = :fecha",
      ExpressionAttributeNames: { 
        "#idbox": "idBox",
        "#fecha": "fecha"
      },
      ExpressionAttributeValues: { 
        ":idbox": Number(idbox), 
        ":fecha": fecha 
      }
    }));

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(result.Items || []),
    };

  } catch (err) {
    console.error("Error en agendamientoTotalHoyBox:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Error interno" }) };
  }
};
