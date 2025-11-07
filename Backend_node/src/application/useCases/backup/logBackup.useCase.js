export class LogBackupUseCase
{
    constructor(backupRepository)
    {
        this.backupRepository= backupRepository;
    }

    async execute(tableName)
    {
        const loggedBackup = await this.backupRepository.logBackup(tableName);

        if(!loggedBackup){
            console.error("Couldn't log backup to the S3");
            return false;
        } 

        return loggedBackup;
    }
}