export class UpdateBoxUseCase
{
    constructor(boxRepository)
    {
        this.boxRepository = boxRepository;
    }

    async execute()
    {
        const updated = await this.boxRepository.updateBox();

        if(!updated) throw new Error("Couldn't update box");
        
        return updated;
    }
}