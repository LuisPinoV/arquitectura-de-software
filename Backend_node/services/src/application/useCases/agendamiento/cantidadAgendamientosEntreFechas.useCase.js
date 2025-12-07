export class CantidadAgendamientosEntreFechasUseCase {
  constructor(agendamientoRepository) {
    this.agendamientoRepository = agendamientoRepository;
  }

  async execute(fechaInicio, fechaFin) {
    try {
      const cantidad = await this.agendamientoRepository.cantidadAgendamientosEntreFechas(fechaInicio, fechaFin);
      return cantidad;
    } catch (error) {
      throw new Error("Couldn't get agendamientos count between dates");
    }
  }
}