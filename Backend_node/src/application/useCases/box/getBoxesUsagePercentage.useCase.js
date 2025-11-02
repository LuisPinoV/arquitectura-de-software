export class GetBoxesUsagePercentageUseCase
{
    constructor(boxRepository)
    {
        this.boxRepository = boxRepository;
    }

    async execute()
    {
        const boxesPercentage = await this.boxRepository.GetBoxesUsagePercentage(date, time);

        if(!boxesPercentage) throw new Error("couldn't get boxes percentage query");

        return boxesPercentage;
    }
}