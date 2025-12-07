export class GetAllAgendamientosUseCase {
  constructor(agendamientoRepository) {
    this.agendamientoRepository = agendamientoRepository;
  }

  async execute() {
    try {
      const agendamientos = await this.agendamientoRepository.getAllAgendamientos();
      return agendamientos;
    } catch (error) {
      throw new Error("Couldn't get all agendamientos");
    }
  }
}