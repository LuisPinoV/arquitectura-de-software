export class GetBoxesUseCase
{
    constructor(boxRepository)
    {
        this.boxRepository = boxRepository;
    }

    async execute()
    {
        const boxes = await this.boxRepository.getAllBoxes();

        if(!boxes) throw new Error("Couldn't get boxes");
        
        return boxes;
    }
}