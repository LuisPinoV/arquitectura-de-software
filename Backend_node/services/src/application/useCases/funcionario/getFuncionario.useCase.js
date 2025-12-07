export class GetFuncionarioUseCase {
  constructor(funcionarioRepository) {
    this.funcionarioRepository = funcionarioRepository;
  }

  async execute(idFuncionario) {
    const funcionario =
      await this.funcionarioRepository.getFuncionario(idFuncionario);

    if (!funcionario)
      throw new Error("Couldn't get funcionario");

    return funcionario;
  }
}
