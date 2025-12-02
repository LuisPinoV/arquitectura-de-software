export class GetAgendamientosByFechaUseCase {
  constructor(agendamientoRepository) {
    this.agendamientoRepository = agendamientoRepository;
  }

  async execute(fecha) {
    try {
      const agendamientos = await this.agendamientoRepository.getAgendamientosByFecha(fecha);
      return agendamientos;
    } catch (error) {
      throw new Error("Couldn't get agendamientos by date");
    }
  }
}