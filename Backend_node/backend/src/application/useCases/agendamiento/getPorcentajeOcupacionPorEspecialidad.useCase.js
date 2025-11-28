export class GetPorcentajeOcupacionPorEspecialidadUseCase {
  constructor(agendamientoRepository) {
    this.agendamientoRepository = agendamientoRepository;
  }

  async execute(fechaInicio, fechaFin) { // ← Agregar parámetros
    try {
      // CORRECCIÓN: Llamar al método correcto del repositorio
      return await this.agendamientoRepository.getPorcentajeOcupacionPorEspecialidad(fechaInicio, fechaFin);
    } catch (error) {
      throw new Error("Couldn't get occupancy percentage by especialidad: " + error.message);
    }
  }
}