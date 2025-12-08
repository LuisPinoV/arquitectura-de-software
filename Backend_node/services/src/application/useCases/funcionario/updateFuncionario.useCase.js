export class UpdateFuncionarioUseCase {
  constructor(funcionarioRepository) {
    this.funcionarioRepository = funcionarioRepository;
  }

  async execute(idFuncionario, updates, organizacionId) {
    const updated = await this.funcionarioRepository.updateFuncionario(idFuncionario, updates, organizacionId);

    if (!updated)
      throw new Error("Couldn't update funcionario");

    return updated;
  }
}
