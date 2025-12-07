export class LogBackupUseCase
{
    constructor(backupRepository)
    {
        this.backupRepository= backupRepository;
    }

    async execute(tableName, data)
    {
        const loggedBackup = this.backupRepository.logBackup(tableName, data);

        if(!loggedBackup){
            console.error("Couldn't log backup to the S3");
            return false;
        } 

        return loggedBackup;
    }
}