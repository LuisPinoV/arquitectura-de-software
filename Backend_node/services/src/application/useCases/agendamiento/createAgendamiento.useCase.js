export class CreateAgendamientoUseCase {
  constructor(agendamientoRepository) {
    this.agendamientoRepository = agendamientoRepository;
  }

  async execute(agendamientoData, organizacionId) {
    try {
      const agendamiento = await this.agendamientoRepository.createAgendamiento(agendamientoData, organizacionId);
      return agendamiento;
    } catch (error) {
      console.error("Error in CreateAgendamientoUseCase:", error);
      throw error; // Re-throw original error instead of generic message
    }
  }
}