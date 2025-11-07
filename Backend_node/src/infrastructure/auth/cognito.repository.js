import {
  InitiateAuthCommand,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  GlobalSignOutCommand,
  GetUserCommand,
  CognitoIdentityProviderClient,
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

      if (res.httpStatusCode == 200) {
        return true;
      } else return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async createUser(username, password) {
    try {
      const createCmd = new AdminCreateUserCommand({
        UserPoolId: this.userPool,
        Username: username,
        TemporaryPassword: password,
        UserAttributes: [
          { Name: "email", Value: username },
          { Name: "email_verified", Value: "true" },
        ],
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

      if (auth) {
        const userData = this.getUserFromIdToken(auth.idToken);

        return {
          ok: true,
          sub: userData.sub,
          idToken: auth.IdToken,
          accessToken: auth.AccessToken,
          refreshToken: auth.refreshToken,
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

      if (response) return response;
      else null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  getUserFromIdToken(idToken) {
    const decoded = jwt.decode(idToken);

    return {
      sub: decoded.sub,
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
