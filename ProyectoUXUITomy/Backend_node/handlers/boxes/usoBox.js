import { ddb, commands } from "../_lib/dynamo.js";

export const main = async (event) => {
  try {
    const qs = event.queryStringParameters || {};
    const { idbox, fecha, hora } = qs;
    if (!idbox || !fecha || !hora) {
      return { statusCode: 400, body: JSON.stringify({ error: "idbox, fecha y hora requeridos" }) };
    }

    const jsonBox = { id: parseInt(idbox), ocupancia: 0, especialidad: '', libre: true, proximoBloque: '' };

    // Obtener la especialidad del box
    const boxResult = await ddb.send(new commands.ScanCommand({
      TableName: process.env.BOX_TABLE || "Box",
      FilterExpression: "#idbox = :idbox",
      ExpressionAttributeNames: { "#idbox": "idbox" },
      ExpressionAttributeValues: { ":idbox": idbox },
      ProjectionExpression: "idbox, idespecialidadbox"
    }));
    const box = boxResult.Items[0];
    if (!box) throw new Error("Box no encontrado");

    // Obtener especialidad
    const espResult = await ddb.send(new commands.ScanCommand({
      TableName: process.env.ESPECIALIDADBOX_TABLE || "especialidadbox",
      FilterExpression: "#id = :id",
      ExpressionAttributeNames: { "#id": "idespecialidadbox" },
      ExpressionAttributeValues: { ":id": box.idespecialidadbox },
      ProjectionExpression: "nombre"
    }));
    jsonBox.especialidad = espResult.Items[0]?.nombre || '';

    // Obtener agendamientos del box en la fecha
    const agendamientosResult = await ddb.send(new commands.ScanCommand({
      TableName: process.env.AGENDAMIENTOS_TABLE || "Agendamiento",
      FilterExpression: "#idbox = :idbox AND #fecha = :fecha",
      ExpressionAttributeNames: { "#idbox": "idbox", "#fecha": "fecha" },
      ExpressionAttributeValues: { ":idbox": idbox, ":fecha": fecha },
      ProjectionExpression: "horaentrada",
    }));

    let proximoBloqueSet = false;
    agendamientosResult.Items
      .sort((a, b) => a.horaentrada.localeCompare(b.horaentrada))
      .forEach(a => {
        jsonBox.ocupancia += 30;
        if (hora === a.horaentrada) jsonBox.libre = false;
        if (a.horaentrada > hora && !proximoBloqueSet) {
          jsonBox.proximoBloque = a.horaentrada;
          proximoBloqueSet = true;
        }
      });

    jsonBox.ocupancia /= 930;

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(jsonBox),
    };

  } catch (err) {
    console.error("Error en usoBox:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Error interno" }) };
  }
};
