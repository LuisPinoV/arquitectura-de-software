export class UpdateAgendamientoUseCase {
  constructor(agendamientoRepository) {
    this.agendamientoRepository = agendamientoRepository;
  }

  async execute(idConsulta, updates) {
    try {
      const updated = await this.agendamientoRepository.updateAgendamiento(idConsulta, updates);
      return updated;
    } catch (error) {
      throw new Error("Couldn't update agendamiento");
    }
  }
}