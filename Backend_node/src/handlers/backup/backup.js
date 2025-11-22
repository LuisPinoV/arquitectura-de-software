import { BackupService } from "../../application/services/backup.service.js";

const backupService = new BackupService();

export async function getDataForBackup(_) {
  try {
    const gotData = await backupService.getDataForBackup();

    if (gotData) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "ok" }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Error getting data ready for backup",
          err
        }),
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error getting data ready for backup",
        err,
      }),
    };
  }
}

export async function saveDataToS3(event) {

  for (const record of event.Records) {
    const snsMessage = record.Sns.Message;

    try {
      const { tableName, data } = JSON.parse(snsMessage);

      console.log("Received SNS message for monthly backup:");
      console.log("Table Name:", tableName);
      console.log("data:", data);

      await backupService.saveDataToS3(tableName, data);
    } catch (err) {
      console.error("Failed to process SNS message:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Internal Error",
        }),
      };
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Created backup of users data",
    }),
  };
}

export async function logDataToS3(event) {

  for (const record of event.Records) {
    const snsMessage = record.Sns.Message;

    try {
      const { tableName, data } = JSON.parse(snsMessage);

      console.log("Received SNS message for monthly backup:");
      console.log("Table Name:", tableName);
      console.log("data:", data);

      await backupService.logBackup(tableName, data);
    } catch (err) {
      console.error("Failed to process SNS message:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Internal Error",
        }),
      };
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Created log of backup",
    }),
  };
}
