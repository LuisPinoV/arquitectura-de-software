import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

import jwt from "jsonwebtoken";

export class TokenRepository {
  constructor(dynamo_client) {
    this.dynamo_client = dynamo_client;
    this.tokenTable = process.env.USER_TOKEN_TABLE;
  }

  async saveRefreshToken(userId, token, expireTime) {
    try {
      const res = await this.dynamo_client.send(
        new PutCommand({
          TableName: this.tokenTable,
          Item: {
            userId: userId,
            refreshToken: token,
            issuedAt: new Date().toISOString(),
            expiresAt: expireTime,
            valid: true,
          },
        })
      );

      if (res) return true;
      else return false;
    } catch (err) {
      console.error("AWS internal error: ", err);
      return false;
    }
  }

  async invalidateTokens(userId) {
    try {
      const res = await this.dynamo_client.send(
        new DeleteCommand({
          TableName: this.tokenTable,
          Key: { userId },
        })
      );
      if (res) return true;
      else return false;
    } catch (err) {
      console.error("AWS Internal error: ", err);
      return false;
    }
  }

  decodeAccessToken(accessToken) {
    try {
      const decoded = jwt.decode(accessToken);
      if (!decoded) throw new Error("Invalid token");
      return {
        userId: decoded.sub,
        username: decoded.username,
        exp: decoded.exp,
      };
    } catch (err) {
      console.error("Failed to decode token:", err);
      return null;
    }
  }

  async updateRefreshToken(userId, newToken, newExpireTime) {
    try {
      await this.dynamo_client.send(
        new PutCommand({
          TableName: this.tokenTable,
          Item: {
            userId,
            refreshToken: newToken,
            issuedAt: new Date().toISOString(),
            expiresAt: newExpireTime,
            valid: true,
          },
        })
      );
      return true;
    } catch (err) {
      console.error("Error updating refresh token:", err);
      return false;
    }
  }
}

export const tokenRepository = new TokenRepository(
  DynamoDBDocumentClient.from(new DynamoDBClient())
);
