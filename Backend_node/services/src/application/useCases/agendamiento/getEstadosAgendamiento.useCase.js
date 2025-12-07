export class GetEstadosAgendamientoUseCase {
  constructor(agendamientoRepository) {
    this.agendamientoRepository = agendamientoRepository;
  }

  async execute(idConsulta) {
    try {
      const estados = await this.agendamientoRepository.getEstadosAgendamiento(idConsulta);
      return estados;
    } catch (error) {
      throw new Error("Couldn't get agendamiento states");
    }
  }
}