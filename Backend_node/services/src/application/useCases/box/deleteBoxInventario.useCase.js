export class DeleteBoxInventarioUseCase {
    constructor(boxRepository) {
        this.boxRepository = boxRepository;
    }

    async execute(idBox, organizacionId) {
        const clearedInventario = await this.boxRepository.deleteInventario(idBox, organizacionId);
        return clearedInventario;
    }
}
