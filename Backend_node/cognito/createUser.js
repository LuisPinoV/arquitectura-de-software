import
{
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import
{
  DynamoDBDocumentClient,
  PutCommand,
} from "@aws-sdk/client-dynamodb";

const cognito = new CognitoIdentityProviderClient();
const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient());

const TABLE_NAME = process.env.USER_PREFERENCES_TABLE;

module.exports.createUser = async (event) => {
  try {
    const { username, password } = JSON.parse(event.body);

    if (!username || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    const createCmd = new AdminCreateUserCommand({
      UserPoolId: process.env.USER_POOL_ID,
      Username: username,
      TemporaryPassword: password,
      UserAttributes: [
        { Name: "email", Value: username },
        { Name: "email_verified", Value: "true" },
      ],
      MessageAction: "SUPPRESS",
      DesiredDeliveryMediums: [],
    });

    const response = await cognito.send(createCmd);


    await cognito.send(
      new AdminSetUserPasswordCommand({
        UserPoolId: process.env.USER_POOL_ID,
        Username: username,
        Password: password,
        Permanent: true,
      })
    );
     
    const now = new Date().toISOString();

    await dynamo.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          userId: response.User.Username,
          profileType: "default",
          preferences: { email: username },
          createdAt: now,
          updatedAt: now,
        },
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User created successfully and profile stored in DynamoDB",
        user: response.User,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
