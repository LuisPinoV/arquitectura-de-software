export class DeleteBoxUseCase
{
    constructor(boxRepository)
    {
        this.boxRepository = boxRepository;
    }

    async execute(idBox)
    {
        const deleted = await this.boxRepository.deleteBox(idBox);

        if(!deleted) throw new Error("Couldn't delete box or didn't exist");
        
        return deleted;
    }
}