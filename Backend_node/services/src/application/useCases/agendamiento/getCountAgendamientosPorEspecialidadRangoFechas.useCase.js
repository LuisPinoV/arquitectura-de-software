export class GetCountAgendamientosPorEspecialidadRangoFechasUseCase {
  constructor(agendamientoRepository) {
    this.agendamientoRepository = agendamientoRepository;
  }

  async execute(fechaInicio, fechaFin) {
    try {
      return await this.agendamientoRepository.getCountAgendamientosPorEspecialidadRangoFechas(fechaInicio, fechaFin);
    } catch (error) {
      throw new Error("Couldn't get count by especialidad in date range: " + error.message);
    }
  }
}
