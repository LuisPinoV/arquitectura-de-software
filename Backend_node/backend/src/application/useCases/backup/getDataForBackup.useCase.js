export class GetDataForBackupUseCase
{
    constructor(backupRepository)
    {
        this.backupRepository = backupRepository;
    }

    async execute(table)
    {
        const data = await this.backupRepository.getDataFromDynamo(table);

        if(!data){
            console.error("Couldn't retrieve data");
            return null;
        } 

        return data;
    }
}