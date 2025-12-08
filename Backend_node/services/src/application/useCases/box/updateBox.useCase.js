export class UpdateBoxUseCase {
    constructor(boxRepository) {
        this.boxRepository = boxRepository;
    }

    async execute(idBox, updates, organizacionId) {
        const updated = await this.boxRepository.updateBox(idBox, updates, organizacionId);

        if (!updated) throw new Error("Couldn't update box");

        return updated;
    }
}