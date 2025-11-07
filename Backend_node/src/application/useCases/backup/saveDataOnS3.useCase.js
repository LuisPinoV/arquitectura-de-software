export class SaveBackupToS3UseCase
{
    constructor(backupRepository)
    {
        this.backupRepository= backupRepository;
    }

    async execute(tableName, data)
    {
        const savedToS3 = await this.backupRepository.saveDataToS3(tableName, data);

        if(!savedToS3){
            console.error("Couldn't save data to the S3");
            return false;
        } 

        return savedToS3;
    }
}