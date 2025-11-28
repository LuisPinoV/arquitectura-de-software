export class GetAgendamientosByEspecialidadUseCase {
  constructor(agendamientoRepository) {
    this.agendamientoRepository = agendamientoRepository;
  }

  async execute(nombreEspecialidad) {
    try {
      // CORRECCIÓN: usar getAgendamientosByEspecialidad (con g minúscula)
      const agendamientos = await this.agendamientoRepository.getAgendamientosByEspecialidad(nombreEspecialidad);
      return agendamientos;
    } catch (error) {
      console.error("Error en GetAgendamientosByEspecialidad use case:", error);
      throw new Error("Couldn't get agendamientos by especialidad: " + error.message);
    }
  }
}