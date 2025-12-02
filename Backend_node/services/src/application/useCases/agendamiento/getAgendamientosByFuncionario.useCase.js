export class GetAgendamientosByFuncionarioUseCase {
  constructor(agendamientoRepository) {
    this.agendamientoRepository = agendamientoRepository;
  }

  async execute(idFuncionario) {
    try {
      const agendamientos = await this.agendamientoRepository.getAgendamientosByFuncionario(idFuncionario);
      return agendamientos;
    } catch (error) {
      throw new Error("Couldn't get agendamientos by funcionario");
    }
  }
}