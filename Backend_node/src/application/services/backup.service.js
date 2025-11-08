import { BackupRepository } from "../../infrastructure/backup/backup.repository.js";
import { GetDataForBackupUseCase } from "../useCases/backup/getDataForBackup.useCase.js";
import { LogBackupUseCase } from "../useCases/backup/logBackup.useCase.js";
import { SaveBackupToS3UseCase } from "../useCases/backup/saveDataOnS3.useCase.js";
import { SendDataMessageUseCase } from "../useCases/backup/sendDataMessage.useCase.js";

export class BackupService {
  constructor() {
    this.backupRepository = new BackupRepository();
  }

  async getDataForBackup() {
    tables = ["Agendamiento", "UserPreferences"];

    const getDataForBackup = new GetDataForBackupUseCase(this.backupRepository);

    try {
      for (table in tables) {
        const data = await getDataForBackup.execute(table);

        // Invoke SNS with data
        this.sendDataBySNS(tableName, data);
      }

      return true;
    } catch (err) {
      console.error("Error backing up data: ", err);
      return false;
    }
  }

  async saveDataToS3(tableName, data) {
    const saveBackupToS3 = new SaveBackupToS3UseCase(this.backupRepository);

    return await saveBackupToS3.execute(tableName, data);
  }

  async logBackup(tableName) {
    const logBackup = new LogBackupUseCase(this.backupRepository);

    return await logBackup.execute(tableName);
  }

  async sendDataBySNS(tableName, data) 
  {
    const sendMessage = new SendDataMessageUseCase(this.backupRepository);

    return await sendMessage.execute(tableName, data);
  }
}
