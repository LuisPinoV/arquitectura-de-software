export class DeleteFuncionarioUseCase {
  constructor(funcionarioRepository) {
    this.funcionarioRepository = funcionarioRepository;
  }

  async execute(idFuncionario) {
    const deleted =
      await this.funcionarioRepository.deleteFuncionario(idFuncionario);

    if (!deleted)
      throw new Error("Couldn't delete funcionario");

    return deleted;
  }
}
