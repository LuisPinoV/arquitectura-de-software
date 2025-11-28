export class GetAgendamientoUseCase {
  constructor(agendamientoRepository) {
    this.agendamientoRepository = agendamientoRepository;
  }

  async execute(idConsulta) {
    try {
      const agendamiento = await this.agendamientoRepository.getAgendamiento(idConsulta);
      return agendamiento;
    } catch (error) {
      throw new Error("Couldn't get agendamiento");
    }
  }
}