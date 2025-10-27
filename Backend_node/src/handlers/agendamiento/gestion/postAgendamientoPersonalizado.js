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
    const body = JSON.parse(event.body || "{}");
    const { idBox, idFuncionario, idPaciente, fecha, horaEntrada, horaSalida } = body;
    if (!idBox || !idFuncionario || !idPaciente || !fecha || !horaEntrada || !horaSalida) {
      return { statusCode: 400, body: JSON.stringify({ error: "Todos los campos son requeridos" }) };
    }

    // Crear agendamiento
    const idagendamiento = uuidv4();
    const agendamiento = {
      idagendamiento,
      idBox,
      idFuncionario,
      idPaciente,
      fecha,
      horaEntrada,
      horaSalida
    };

    await ddb.send(new PutCommand({
      TableName: process.env.AGENDAMIENTOS_TABLE || "Agendamiento",
      Item: agendamiento
    }));

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ agendamiento, estadoAgendamiento }),
    };

  } catch (err) {
    console.error("Error en postAgendamientoPersonalizado:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Error interno" }) };
  }
};
