export class GetBoxesUseCase {
    constructor(boxRepository) {
        this.boxRepository = boxRepository;
    }

    async execute(organizacionId) {
        const boxes = await this.boxRepository.getAllBoxes(organizacionId);

        if (!boxes) throw new Error("Couldn't get boxes");

        return boxes;
    }
}