export class GetAgendamientosByPacienteUseCase {
  constructor(agendamientoRepository) {
    this.agendamientoRepository = agendamientoRepository;
  }

  async execute(idPaciente) {
    try {
      const agendamientos = await this.agendamientoRepository.getAgendamientosByPaciente(idPaciente);
      return agendamientos;
    } catch (error) {
      throw new Error("Couldn't get agendamientos by patient");
    }
  }
}