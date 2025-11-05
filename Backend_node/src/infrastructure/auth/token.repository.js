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
  }

  async saveRefreshToken(userId, token, expireTime) {
    const res = await dynamo_client.send(
      new PutCommand({
        TableName: process.env.USER_TOKEN_TABLE,
        Item: {
          userId: userId,
          refreshToken: token,
          issuedAt: new Date().toISOString(),
          expiresAt: expireTime,
          valid: true,
        },
      })
    );

    if (res.ok) return true;
    else return false;
  }

  async invalidateTokens(userId) {
    await dynamo_client.send(
      new DeleteCommand({
        TableName: process.env.USER_TOKEN_TABLE,
        Key: { userId },
      })
    );
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
          TableName: process.env.USER_TOKEN_TABLE,
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
