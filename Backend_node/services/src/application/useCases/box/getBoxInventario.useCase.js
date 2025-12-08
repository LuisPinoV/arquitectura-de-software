export class GetBoxInventarioUseCase {
    constructor(boxRepository) {
        this.boxRepository = boxRepository;
    }

    async execute(idBox, organizacionId) {
        const inventario = await this.boxRepository.getInventario(idBox, organizacionId);
        if (!inventario) throw new Error("Couldn't get box inventario");
        return inventario;
    }
}
