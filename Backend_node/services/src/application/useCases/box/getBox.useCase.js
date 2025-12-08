export class GetBoxUseCase {
    constructor(boxRepository) {
        this.boxRepository = boxRepository;
    }

    async execute(idBox, organizacionId) {
        const box = await this.boxRepository.getBox(idBox, organizacionId);

        if (!box) throw new Error("Couldn't get box");

        return box;
    }
}