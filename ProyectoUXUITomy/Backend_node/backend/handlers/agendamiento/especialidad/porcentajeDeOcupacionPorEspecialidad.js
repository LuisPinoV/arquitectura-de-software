import { ddb, commands } from "../_lib/dynamo.js";

export const main = async (event) => {
  try {
    const qs = event.queryStringParameters || {};
    const { especialidad, fecha } = qs;
    if (!especialidad || !fecha) {
      return { statusCode: 400, body: JSON.stringify({ error: "especialidad y fecha requeridos" }) };
    }

    // Obtener idespecialidadbox
    const espResult = await ddb.send(new commands.ScanCommand({
      TableName: process.env.ESPECIALIDADBOX_TABLE || "especialidadbox",
      FilterExpression: "#nombre = :nombre",
      ExpressionAttributeNames: { "#nombre": "nombre" },
      ExpressionAttributeValues: { ":nombre": especialidad },
      ProjectionExpression: "idespecialidadbox"
    }));
    if (!espResult.Items[0]) {
      return { statusCode: 404, body: JSON.stringify({ error: "Especialidad no encontrada" }) };
    }
    const idespecialidadbox = espResult.Items[0].idespecialidadbox;

    // Obtener todos los boxes de esa especialidad
    const boxesResult = await ddb.send(new commands.ScanCommand({
      TableName: process.env.BOX_TABLE || "Box",
      FilterExpression: "#idesp = :idesp",
      ExpressionAttributeNames: { "#idesp": "idespecialidadbox" },
      ExpressionAttributeValues: { ":idesp": idespecialidadbox },
      ProjectionExpression: "idbox"
    }));
    const boxIds = boxesResult.Items.map(b => b.idbox);
    const totalBoxes = boxIds.length;
    if (totalBoxes === 0) return { statusCode: 200, body: JSON.stringify(0) };

    // Traer agendamientos de esos boxes en la fecha
    const agendamientosResult = await ddb.send(new commands.ScanCommand({
      TableName: process.env.AGENDAMIENTOS_TABLE || "Agendamiento",
      FilterExpression: "#fecha = :fecha AND (" + boxIds.map((_, i) => `idbox = :id${i}`).join(" OR ") + ")",
      ExpressionAttributeNames: { "#fecha": "fecha" },
      ExpressionAttributeValues: Object.assign({ ":fecha": fecha }, Object.fromEntries(boxIds.map((id, i) => [`:id${i}`, id])))
    }));

    // Calcular ocupación en minutos
    let minutosOcupados = 0;
    agendamientosResult.Items.forEach(a => {
      const [h1, m1] = a.horaentrada.split(":").map(Number);
      const [h2, m2] = a.horasalida.split(":").map(Number);
      minutosOcupados += (h2 - h1) * 60 + (m2 - m1);
    });

    const porcentaje = minutosOcupados / (930 * totalBoxes);

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(porcentaje),
    };

  } catch (err) {
    console.error("Error en PorcentajeDeOcupacionPorEspecialidad:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Error interno" }) };
  }
};
