import {
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";

import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient();
const dynamo = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.USER_PREFERENCES_TABLE;

export const createProfile = async (event) => {
  const body = JSON.parse(event.body);
  const { userId, profileType, preferences } = body;

  const now = new Date().toISOString();

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: {
      userId,
      profileType,
      preferences,
      isCurrent: false,
      createdAt: now,
      updatedAt: now,
    },
  });

  await dynamo.send(command);

  return {
    statusCode: 201,
    body: JSON.stringify({ message: "Perfil creado correctamente" }),
  };
};

export const getProfile = async (event) => {
  const { userId, profileType } = event.pathParameters;

  try {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { userId, profileType },
    });

    const result = await dynamo.send(command);

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Perfil no encontrado" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export const getProfiles = async (event) => {
  const { userId } = event.pathParameters;
  const command = new QueryCommand({ 
    TableName: TABLE_NAME, 
    KeyConditionExpression: "userId = :pk",
    ExpressionAttributeValues: {
      ":pk": userId,
    },
   });
   
  const result = await dynamo.send(command);

  if (!result.Items) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Usuario no encontrado" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items),
  };
};

export const updateProfile = async (event) => {
  const { userId, profileType } = event.pathParameters;
  const body = JSON.parse(event.body);

  const now = new Date().toISOString();

  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { userId, profileType },
    UpdateExpression: "set preferences = :p, updatedAt = :u",
    ExpressionAttributeValues: {
      ":p": body.preferences,
      ":u": now,
    },
    ReturnValues: "ALL_NEW",
  });

  const result = await dynamo.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify(result.Attributes),
  };
};

export const deleteProfile = async (event) => {
  const { userId, profileType } = event.pathParameters;

  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { userId, profileType },
  });

  await dynamo.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Perfil eliminado correctamente" }),
  };
};

export const getCurrentProfile = async (event) => {
  const { userId } = event.pathParameters;

  const command = new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: "userId = :u",
    FilterExpression: "isCurrent = :c",
    ExpressionAttributeValues: {
      ":u": userId,
      ":c": true,
    },
  });

  const result = await dynamo.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items?.[0] || null),
  };
};

/**
 * Marca un perfil como el actual (isCurrent=true).
 * Primero pone todos los perfiles del usuario en false,
 * luego marca el elegido como true.
 */
export const setCurrentProfile = async (event) => {
  const { userId, profileType } = event.pathParameters;

  // 1. Traer todos los perfiles del usuario
  const profiles = await dynamo.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "userId = :u",
      ExpressionAttributeValues: { ":u": userId },
    })
  );

  // 2. Poner todos en false
  for (const profile of profiles.Items) {
    await dynamo.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { userId, profileType: profile.profileType },
        UpdateExpression: "set isCurrent = :f",
        ExpressionAttributeValues: { ":f": false },
      })
    );
  }

  // 3. Marcar el perfil seleccionado como true
  await dynamo.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { userId, profileType },
      UpdateExpression: "set isCurrent = :t",
      ExpressionAttributeValues: { ":t": true },
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Perfil marcado como actual" }),
  };
};
