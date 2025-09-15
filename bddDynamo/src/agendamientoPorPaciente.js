const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient();
const dynamodb = DynamoDBDocumentClient.from(client);

module.exports.obtenerAgendamientosPorPaciente = async (event) => {
  try {
    const pacienteId =
      event.pathParameters?.pacienteId ||
      event.queryStringParameters?.pacienteId;

    if (!pacienteId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Debes enviar un pacienteId" }),
      };
    }

    const params = {
      TableName: "Agendamiento",
      IndexName: "AgendamientosPorPaciente",
      KeyConditionExpression: "PacienteId = :paciente",
      ExpressionAttributeValues: {
        ":paciente": `PACIENTE#${pacienteId}`,
      },
    };

    const agendamientosRes = await dynamodb.send(new QueryCommand(params));
    const agendamientos = agendamientosRes.Items || [];
    const resultados = [];
    for (const ag of agendamientos) {
      const detalleParams = {
        TableName: "Agendamiento",
        KeyConditionExpression: "PK = :pk",
        ExpressionAttributeValues: {
          ":pk": `AGENDAMIENTO#${ag.idConsulta}`,
        },
      };

      const detalleRes = await dynamodb.send(new QueryCommand(detalleParams));
      const detalleItems = detalleRes.Items || [];

      const metadata = detalleItems.find((i) => i.SK === "METADATA");
      const estados = detalleItems.filter((i) =>
        i.SK.startsWith("ESTADO#")
      );
      const resultado = detalleItems.find((i) => i.SK === "RESULTADO");

      resultados.push({
        ...metadata,
        estados: estados.map((e) => ({
          estado: e.estado,
          fechaEstado: e.fechaEstado,
        })),
        resultado: resultado || null,
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify(resultados),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error al consultar agendamientos" }),
    };
  }
};
