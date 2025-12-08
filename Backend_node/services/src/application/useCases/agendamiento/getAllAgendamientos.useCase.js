export class GetAllAgendamientosUseCase {
  constructor(agendamientoRepository) {
    this.agendamientoRepository = agendamientoRepository;
  }

  async execute(organizacionId) {
    const agendamientos = await this.agendamientoRepository.getAllAgendamientos(organizacionId);

    if (!agendamientos) {
      throw new Error("Couldn't get all agendamientos");
    }

    return agendamientos;
  }
}