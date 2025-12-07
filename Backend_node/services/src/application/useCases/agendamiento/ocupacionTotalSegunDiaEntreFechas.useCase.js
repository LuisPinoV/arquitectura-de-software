export class OcupacionTotalSegunDiaEntreFechasUseCase {
  constructor(agendamientoRepository) {
    this.agendamientoRepository = agendamientoRepository;
  }

  async execute(fechaInicio, fechaFin) {
    try {
      const resultado = await this.agendamientoRepository.ocupacionTotalSegunDiaEntreFechas(fechaInicio, fechaFin);
      return resultado;
    } catch (error) {
      throw new Error("Couldn't calculate daily occupancy between dates");
    }
  }
}