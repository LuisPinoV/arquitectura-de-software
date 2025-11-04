import {
  InitiateAuthCommand,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  GlobalSignOutCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/client-dynamodb";

import jwtDecode from "jwt-decode";

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
      const auth = out.AuthenticationResult;

      //Save to logs
      const userData = this.getUserFromIdToken(auth.IdToken);

      await dynamo_client.send(
        new PutCommand({
          TableName: process.env.TOKENS_TABLE,
          Item: {
            userId: userData.sub,
            refreshToken: auth.RefreshToken,
            issuedAt: new Date().toISOString(),
            expiresAt: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
            valid: true,
          },
        })
      );

      return auth
        ? {
            accessToken: auth.AccessToken,
            idToken: auth.IdToken,
            refreshToken: auth.RefreshToken,
            expiresIn: auth.ExpiresIn,
          }
        : {};
    } catch (err) {
      console.error(err);
      return {};
    }
  }

  async logout(accessToken) {
    try {
      const cmd = new GlobalSignOutCommand({ AccessToken: accessToken });
      const res = await this.cognito_client.send(cmd);

      if (res.httpStatusCode == 200) return true;
      else return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async createUser(username, password, userPool) {
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

      const preferencesTable = process.env.USER_PREFERENCES_TABLE;

      const now = new Date().toISOString();

      await this.dynamo_client.send(
        new PutCommand({
          TableName: preferencesTable,
          Item: {
            userId: response.User.Username,
            profileType: "default",
            preferences: { email: username },
            createdAt: now,
            updatedAt: now,
          },
        })
      );

      return true;
    } catch (err) {
      return false;
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
      error: "Couldn't refresh token",
    });
  }

  getUserFromIdToken(idToken) {
    const decoded = jwtDecode(idToken);
    return {
      sub: claims.sub,
      username: decoded["cognito:username"],
      email: decoded.email,
      groups: decoded["cognito:groups"],
      exp: decoded.exp,
    };
  }
}

export const cognitoRepository = new CognitoRepository(
  new CognitoIdentityProviderClient({}),
  DynamoDBDocumentClient.from(new DynamoDBClient())
);
