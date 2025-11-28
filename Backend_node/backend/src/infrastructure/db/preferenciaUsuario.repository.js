import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
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

export class UserPreferencesRepository {
  constructor(tableName) {
    this.tableName = tableName;
    this.dynamo = dynamo;
  }

  async createProfile(userId, profileType, preferences, isCurrent = false) {
    const now = new Date().toISOString();

    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        userId,
        profileType,
        preferences,
        isCurrent,
        createdAt: now,
        updatedAt: now,
      },
    });

    await this.dynamo.send(command);
    return {
      userId,
      profileType,
      preferences,
      isCurrent,
      createdAt: now,
      updatedAt: now,
    };
  }

  async getProfile(userId, profileType) {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { userId, profileType },
    });

    const result = await this.dynamo.send(command);
    return result.Item;
  }

  async getProfilesByUserId(userId) {
    const command = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: "userId = :pk",
      ExpressionAttributeValues: {
        ":pk": userId,
      },
    });

    const result = await this.dynamo.send(command);
    return result.Items || [];
  }

  async updateProfile(userId, profileType, preferences) {
    const now = new Date().toISOString();

    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { userId, profileType },
      UpdateExpression: "SET preferences = :p, updatedAt = :u",
      ExpressionAttributeValues: {
        ":p": preferences,
        ":u": now,
      },
      ReturnValues: "ALL_NEW",
    });

    const result = await this.dynamo.send(command);
    return result.Attributes;
  }

  async deleteProfile(userId, profileType) {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: { userId, profileType },
    });

    await this.dynamo.send(command);
    return { userId, profileType };
  }

  async getCurrentProfile(userId) {
    const command = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: "userId = :u",
      FilterExpression: "isCurrent = :c",
      ExpressionAttributeValues: {
        ":u": userId,
        ":c": true,
      },
    });

    const result = await this.dynamo.send(command);
    return result.Items?.[0] || null;
  }

  async setCurrentProfile(userId, profileType) {
    const profiles = await this.getProfilesByUserId(userId);

    for (const profile of profiles) {
      await this.dynamo.send(
        new UpdateCommand({
          TableName: this.tableName,
          Key: { userId, profileType: profile.profileType },
          UpdateExpression: "SET isCurrent = :f",
          ExpressionAttributeValues: { ":f": false },
        })
      );
    }

    await this.dynamo.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { userId, profileType },
        UpdateExpression: "SET isCurrent = :t",
        ExpressionAttributeValues: { ":t": true },
      })
    );

    return { userId, profileType, isCurrent: true };
  }

  async updateProfileCurrentStatus(userId, profileType, isCurrent) {
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { userId, profileType },
      UpdateExpression: "SET isCurrent = :c",
      ExpressionAttributeValues: {
        ":c": isCurrent,
      },
      ReturnValues: "ALL_NEW",
    });

    const result = await this.dynamo.send(command);
    return result.Attributes;
  }

  async onCreatedNewUser(userId, username) {
    const now = new Date().toISOString();
    const cmd = new PutCommand({
      TableName: this.tableName,
      Item: {
        userId: userId,
        profileType: "default",
        preferences: { email: username },
        createdAt: now,
        updatedAt: now,
      },
    });

    const result = await this.dynamo.send(cmd);

    return result;
  }
}

export const userPreferencesRepository = new UserPreferencesRepository(
  process.env.USER_PREFERENCES_TABLE
);
