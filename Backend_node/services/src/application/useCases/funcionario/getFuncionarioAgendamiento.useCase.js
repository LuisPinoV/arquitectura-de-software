export class GetFuncionarioAgendamientoUseCase {
  constructor(funcionarioRepository) {
    this.funcionarioRepository = funcionarioRepository;
  }

  async execute(idFuncionario) {
    const agendamientosFuncionario =
      await this.funcionarioRepository.getAgendamientosByFuncionario(idFuncionario);

    if (!agendamientosFuncionario)
      throw new Error("Couldn't get agendamientos by funcionario");

    return agendamientosFuncionario;
  }
}
