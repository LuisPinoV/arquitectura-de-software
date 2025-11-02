export class GetBoxUseCase
{
    constructor(boxRepository)
    {
        this.boxRepository = boxRepository;
    }

    async execute(idBox)
    {
        const box = await this.boxRepository.getBox(idBox);

        if(!box) throw new Error("Couldn't get box");
        
        return box;
    }
}