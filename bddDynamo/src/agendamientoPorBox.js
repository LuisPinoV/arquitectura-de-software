const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient();
const dynamodb = DynamoDBDocumentClient.from(client);

module.exports.obtenerAgendamientosPorBox = async (event) => {
  try {
    const boxId = event.pathParameters?.boxId || event.queryStringParameters?.boxId;

    if (!boxId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Debes enviar un boxId" }),
      };
    }

    const params = {
      TableName: "Agendamiento",
      FilterExpression: "BoxId = :box",
      ExpressionAttributeValues: {
        ":box": `BOX#${boxId}`
      }
    };

    const result = await dynamodb.send(new ScanCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items || []),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error al consultar agendamientos por Box" }),
    };
  }
};
