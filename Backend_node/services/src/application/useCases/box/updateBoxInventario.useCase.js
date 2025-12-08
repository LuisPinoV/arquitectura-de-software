export class UpdateBoxInventarioUseCase {
    constructor(boxRepository) {
        this.boxRepository = boxRepository;
    }

    async execute(idBox, inventario, organizacionId) {
        const updatedInventario = await this.boxRepository.updateInventario(idBox, inventario, organizacionId);
        // updateInventario en repositorio ya valida si el box existe y tiene permisos
        return updatedInventario;
    }
}
