export class AgendamientoTotalHoyBoxUseCase {
  constructor(agendamientoRepository) {
    this.agendamientoRepository = agendamientoRepository;
  }

  async execute(idBox, fecha, organizacionId) {
    try {
      const agendamientos = await this.agendamientoRepository.agendamientoTotalHoyBox(idBox, fecha, organizacionId);
      return agendamientos;
    } catch (error) {
      throw new Error("Couldn't get agendamientos for box today: " + error.message);
    }
  }
}