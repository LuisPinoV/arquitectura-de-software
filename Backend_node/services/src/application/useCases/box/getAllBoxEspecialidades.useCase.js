export class GetAllBoxEspecialidadesUseCase {
    constructor(boxRepository) {
        this.boxRepository = boxRepository;
    }

    async execute(organizacionId) {
        const especialidades = await this.boxRepository.getAllEspecialidades(organizacionId);
        return especialidades || [];
    }
}
