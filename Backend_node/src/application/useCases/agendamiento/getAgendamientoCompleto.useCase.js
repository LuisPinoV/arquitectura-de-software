export class GetAgendamientoCompletoUseCase {
  constructor(agendamientoRepository) {
    this.agendamientoRepository = agendamientoRepository;
  }

  async execute(idConsulta) {
    try {
      const agendamientoCompleto = await this.agendamientoRepository.getAgendamientoCompleto(idConsulta);
      return agendamientoCompleto;
    } catch (error) {
      throw new Error("Couldn't get complete agendamiento");
    }
  }
}