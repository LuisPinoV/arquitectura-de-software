export class DeleteAgendamientoUseCase {
  constructor(agendamientoRepository) {
    this.agendamientoRepository = agendamientoRepository;
  }

  async execute(idConsulta) {
    try {
      const deleted = await this.agendamientoRepository.deleteAgendamiento(idConsulta);
      return deleted;
    } catch (error) {
      throw new Error("Couldn't delete agendamiento");
    }
  }
}