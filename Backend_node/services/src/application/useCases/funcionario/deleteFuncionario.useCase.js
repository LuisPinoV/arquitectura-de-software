export class DeleteFuncionarioUseCase {
  constructor(funcionarioRepository) {
    this.funcionarioRepository = funcionarioRepository;
  }

  async execute(idFuncionario, organizacionId) {
    const deleted = await this.funcionarioRepository.deleteFuncionario(idFuncionario, organizacionId);

    if (!deleted)
      throw new Error("Couldn't delete funcionario");

    return deleted;
  }
}
