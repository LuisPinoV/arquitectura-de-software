export class GetCountAgendamientosPorEspecialidadUseCase {
  constructor(agendamientoRepository) {
    this.agendamientoRepository = agendamientoRepository;
  }

  async execute() {
    try {
      return await this.agendamientoRepository.getCountAgendamientosPorEspecialidad();
    } catch (error) {
      throw new Error("Couldn't get count by especialidad: " + error.message);
    }
  }
}
