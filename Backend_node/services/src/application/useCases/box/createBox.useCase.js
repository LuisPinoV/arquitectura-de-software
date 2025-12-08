export class CreateBoxUseCase {
    constructor(boxRepository) {
        this.boxRepository = boxRepository;
    }

    async execute(body) {
        const box = await this.boxRepository.createBox(body);

        if (!box) throw new Error("Couldn't create box");

        return box;
    }
}