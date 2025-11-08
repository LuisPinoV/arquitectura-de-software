import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";


export class BackupRepository {
  constructor() {
    this.bucketName = process.env.MONTHLY_BACKUP_BUCKET;

    const client = new DynamoDBClient();
    this.dynamo = DynamoDBDocumentClient.from(client);

    this.s3Client = new S3Client();
    this.snsClient = new SNSClient({});

    this.monthlyBackupArn = process.env.MONTHLY_BACKUP_TOPIC_SNS_ARN;
  }
  async saveDataToS3(items, tableName) {
    try {
      console.log(
        `Se encontraron ${items.length} elementos en la tabla ${tableName}`
      );
      const timestamp = this.generateTimestamp();
      const s3Result = await this.saveToS3(items, timestamp, tableName);

      return {
        success: true,
        tableName: tableName,
        itemsCount: items.length,
        backupFile: s3Result.key,
        timestamp: timestamp,
      };
    } catch (error) {
      console.error(`Error en backup para tabla ${tableName}:`, error);

      return {
        success: false,
        tableName: this.tableName,
        error: error.message,
      };
    }
  }

  async getDataFromDynamo(tableName) {
    let items = [];
    let lastEvaluatedKey = undefined;

    do {
      const command = new ScanCommand({
        TableName: tableName,
        ExclusiveStartKey: lastEvaluatedKey,
      });

      const result = await this.dynamo.send(command);
      items = items.concat(result.Items || []);
      lastEvaluatedKey = result.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    return items;
  }

  async saveToS3(items, timestamp, tableName) {
    const key = `${this.tableName}/snapshot-${timestamp}.json`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: JSON.stringify(
        {
          tableName: tableName,
          backupTimestamp: timestamp,
          itemCount: items.length,
          items: items,
        },
        null,
        2
      ),
      ContentType: "application/json",
    });

    await this.s3Client.send(command);

    return { key };
  }

  async sendSNSWithData(tableName, data)
  {
    const params = {
      TopicArn: this.monthlyBackupArn,
      Message: JSON.stringify({
        tableName: tableName,
        data: data,
      }),
    };

    try {
      const response = await this.snsClient.send(new PublishCommand(params));

      console.log("SNS message published:", response.MessageId);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Backup data message published succesfully",
        }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Couldn't publish backup data message: ",
          err,
        }),
      };
    }
  }

  logBackup(tableName)
  {
    console.log(`Se hizo backup de la tabla: ${tableName},
                \n en la fecha: ${this.generateTimestamp()}`);
  }

  generateTimestamp() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
  }
}