import {
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export class CognitoRepository {
  cognito_client;
  dynamo_client;

  constructor(cognito_client, dynamo_client) {
    this.cognito_client = cognito_client;
    this.dynamo_client = dynamo_client;
  }

  async login(username, password, userPool) {
    try {
      const cmd = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: userPool,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      });

      const out = await this.cognito_client.send(cmd);

      if (out.ChallengeName) {
        // TODO: Manage challenges
        return out.ChallengeName ?? {};
      }

      return this.response(200, {
        ok: true,
        idToken: auth.IdToken,
        accessToken: auth.AccessToken,
        refreshToken: auth.RefreshToken,
        expiresIn: auth.ExpiresIn,
      });
    } catch (err) {
      console.error(err);
      return {};
    }
  }

  async createUser(username, password, tableName, userPool) {
    try {
      const createCmd = new AdminCreateUserCommand({
        UserPoolId: userPool,
        Username: username,
        TemporaryPassword: password,
        UserAttributes: [
          { Name: "email", Value: username },
          { Name: "email_verified", Value: "true" },
        ],
        MessageAction: "SUPPRESS",
        DesiredDeliveryMediums: [],
      });

      const response = await this.cognito_client.send(createCmd);

      await cognito.send(
        new AdminSetUserPasswordCommand({
          UserPoolId: userPool,
          Username: username,
          Password: password,
          Permanent: true,
        })
      );

      const now = new Date().toISOString();

      await this.dynamo_client.send(
        new PutCommand({
          TableName: tableName,
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
  }

  async refreshSession(refreshToken, poolClientId) {
    const cmd = new InitiateAuthCommand({
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: poolClientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    });

    const out = await this.cognito_client.send(cmd);
    const auth = out.AuthenticationResult || {};

    return this.response(200, {
      ok: true,
      idToken: auth.IdToken,
      accessToken: auth.AccessToken,
      expiresIn: auth.ExpiresIn,
    });
  }
  catch(err) {
    console.error(err);
    return this.response(400, {
      ok: false,
      error: "No se pudo refrescar el token",
    });
  }

  async getUserData(claims)
  {

    return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      ok: true,
      sub: claims.sub,
      email: claims.email,
      username: claims["cognito:username"],
      groups: claims["cognito:groups"] || [],
      claims
    })
  };
  }

  response(statusCode, body) {
    return {
      statusCode,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    };
  }
  
}

export const cognitoRepository = CognitoRepository;
