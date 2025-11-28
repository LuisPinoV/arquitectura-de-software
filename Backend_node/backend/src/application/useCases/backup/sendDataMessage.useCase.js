export class SendDataMessageUseCase
{
    constructor(backupRepository)
    {
        this.backupRepository= backupRepository;
    }

    async execute(tableName, data)
    {
        const sentSNS = await this.backupRepository.sendSNSWithData(tableName, data);

        if(!sentSNS){
            console.error("Couldn't send message with data");
            return false;
        } 

        return sentSNS;
    }
}