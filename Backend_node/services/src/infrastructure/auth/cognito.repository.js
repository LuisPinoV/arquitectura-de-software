import {
  InitiateAuthCommand,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminUpdateUserAttributesCommand,
  GlobalSignOutCommand,
  GetUserCommand,
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import jwt from "jsonwebtoken";

export class CognitoRepository {
  constructor(cognitoClient, userPool, clientId) {
    this.cognitoClient = cognitoClient;
    this.userPool = userPool;
    this.clientId = clientId;
  }

  async login(username, password) {
    try {
      const cmd = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: this.clientId,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      });

      const out = await this.cognitoClient.send(cmd);
      const auth = out.AuthenticationResult;

      const userData = this.getUserFromIdToken(auth.IdToken);

      return auth
        ? {
            sub: userData.sub,
            accessToken: auth.AccessToken,
            idToken: auth.IdToken,
            refreshToken: auth.RefreshToken,
            expiresIn: auth.ExpiresIn,
          }
        : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async logout(accessToken) {
    try {
      const cmd = new GlobalSignOutCommand({ AccessToken: accessToken });
      const res = await this.cognitoClient.send(cmd);

      if (res) {
        return true;
      } else return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async createUser(
    username,
    password,
    name = null,
    companyName = null,
    spaceName = null,
    group = "Administradores"
  ) {
    try {
      const userAttributes = [
        { Name: "email", Value: username },
        { Name: "email_verified", Value: "true" },
      ];

      if (name) userAttributes.push({ Name: "name", Value: name });
      // also set preferred_username and nickname to the friendly name when provided
      if (name) {
        userAttributes.push({ Name: "preferred_username", Value: name });
        userAttributes.push({ Name: "nickname", Value: name });
      }
      if (companyName)
        userAttributes.push({ Name: "custom:companyName", Value: companyName });
      if (spaceName)
        userAttributes.push({ Name: "custom:spaceName", Value: spaceName });

      const createCmd = new AdminCreateUserCommand({
        UserPoolId: this.userPool,
        Username: username,
        TemporaryPassword: password,
        UserAttributes: userAttributes,
        MessageAction: "SUPPRESS",
        DesiredDeliveryMediums: [],
      });

      const response = await this.cognitoClient.send(createCmd);

      await this.cognitoClient.send(
        new AdminSetUserPasswordCommand({
          UserPoolId: this.userPool,
          Username: username,
          Password: password,
          Permanent: true,
        })
      );

      await this.cognitoClient.send(
        new AdminAddUserToGroupCommand({
          UserPoolId: process.env.USER_POOL_ID,
          Username: username,
          GroupName: group,
        })
      );

      return { userId: response.User.Username };
    } catch (err) {
      console.error("There was an internal error: ", err);
      return null;
    }
  }

  async refreshSession(refreshToken) {
    const cmd = new InitiateAuthCommand({
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: this.clientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    });

    try {
      const out = await this.cognitoClient.send(cmd);
      const auth = out.AuthenticationResult;
      console.log(out.AuthenticationResult);

      if (auth) {
        const userData = this.getUserFromIdToken(auth.IdToken);

        return {
          ok: true,
          sub: userData.sub,
          idToken: auth.IdToken,
          accessToken: auth.AccessToken,
          expiresIn: auth.ExpiresIn,
        };
      } else return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async getUserData(accessToken) {
    const cmd = new GetUserCommand({
      AccessToken: accessToken,
    });

    try {
      const response = await this.cognitoClient.send(cmd);

      return response ?? null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async updateUserAttributes(username, attrs = {}) {
    try {
      const userAttributes = [];
      if (attrs.name) {
        userAttributes.push({ Name: "name", Value: String(attrs.name) });
        userAttributes.push({
          Name: "preferred_username",
          Value: String(attrs.name),
        });
        userAttributes.push({ Name: "nickname", Value: String(attrs.name) });
      }
      if (attrs.companyName) {
        userAttributes.push({
          Name: "custom:companyName",
          Value: String(attrs.companyName),
        });
      }
      if (attrs.spaceName) {
        userAttributes.push({
          Name: "custom:spaceName",
          Value: String(attrs.spaceName),
        });
      }

      if (userAttributes.length === 0)
        return { ok: false, message: "No attributes to update" };

      const cmd = new AdminUpdateUserAttributesCommand({
        UserPoolId: this.userPool,
        Username: username,
        UserAttributes: userAttributes,
      });

      const res = await this.cognitoClient.send(cmd);

      return { ok: true, res };
    } catch (err) {
      console.error("Error updating user attributes", err);
      return { ok: false, error: err };
    }
  }

  getUserFromIdToken(idToken) {
    console.log(idToken);
    const decoded = jwt.decode(idToken);

    console.log(decoded);
    return {
      sub: decoded["sub"],
      username: decoded["cognito:username"],
      email: decoded.email,
      groups: decoded["cognito:groups"],
      exp: decoded.exp,
    };
  }
}

export const cognitoRepository = new CognitoRepository(
  new CognitoIdentityProviderClient({}),
  process.env.USER_POOL_ID,
  process.env.USER_POOL_CLIENT_ID
);
