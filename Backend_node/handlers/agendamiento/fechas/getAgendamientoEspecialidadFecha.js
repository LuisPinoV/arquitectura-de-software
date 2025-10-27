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

export const main = async (event) => {
  try {
    const qs = event.queryStringParameters || {};
    const { especialidad, fecha1, fecha2 } = qs;
    if (!especialidad || !fecha1 || !fecha2) {
      return { statusCode: 400, body: JSON.stringify({ error: "especialidad, fecha1 y fecha2 requeridos" }) };
    }

    // Obtener idEspecialidadBox de la tabla EspecialidadBox
    const resultEspecialidades = await ddb.send(new ScanCommand({
      TableName: process.env.ESPECIALIDADBOX_TABLE || "EspecialidadBox"
    }));

    const especialidadObj = resultEspecialidades.Items.find(e => e.especialidad === especialidad);
    if (!especialidadObj) {
      return { statusCode: 404, body: JSON.stringify({ error: "Especialidad no existente" }) };
    }
    const idEspecialidadBox = especialidadObj.idespecialidadbox;

    // Obtener agendamientos de esa especialidad entre fechas
    const resultAgendamientos = await ddb.send(new ScanCommand({
      TableName: process.env.AGENDAMIENTOS_TABLE || "Agendamiento",
      FilterExpression: "#idEsp = :idEsp AND #fecha BETWEEN :f1 AND :f2",
      ExpressionAttributeNames: { "#idEsp": "idEspecialidadBox", "#fecha": "fecha" },
      ExpressionAttributeValues: { ":idEsp": idEspecialidadBox, ":f1": fecha1, ":f2": fecha2 }
    }));

    const listaAgendamientos = resultAgendamientos.Items.map(item => ({
      idagendamiento: item.idagendamiento,
      idbox: item.idBox,
      idfuncionario: item.idFuncionario,
      idpaciente: item.idPaciente,
      fecha: item.fecha,
      horaentrada: item.horaEntrada,
      horasalida: item.horaSalida
    }));

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(listaAgendamientos),
    };

  } catch (err) {
    console.error("Error en getAgendamientoEspecialidadFecha:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Error interno" }) };
  }
};
