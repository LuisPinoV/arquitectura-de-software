export class GetAllBoxInventariosUseCase {
    constructor(boxRepository) {
        this.boxRepository = boxRepository;
    }

    async execute(organizacionId) {
        const inventarios = await this.boxRepository.getAllInventarios(organizacionId);
        if (!inventarios) throw new Error("Couldn't get all box inventarios");
        return inventarios;
    }
}
