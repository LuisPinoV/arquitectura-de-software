export class AddEstadoAgendamientoUseCase {
  constructor(agendamientoRepository) {
    this.agendamientoRepository = agendamientoRepository;
  }

  async execute(idConsulta, estado) {
    try {
      const nuevoEstado = await this.agendamientoRepository.addEstadoAgendamiento(idConsulta, estado);
      return nuevoEstado;
    } catch (error) {
      throw new Error("Couldn't add agendamiento state");
    }
  }
}