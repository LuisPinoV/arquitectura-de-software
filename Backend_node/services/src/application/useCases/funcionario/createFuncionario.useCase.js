export class CreateFuncionarioUseCase {
  constructor(funcionarioRepository) {
    this.funcionarioRepository = funcionarioRepository;
  }

  async execute(body) {
    const created =
      await this.funcionarioRepository.createFuncionario(body);

    if (!created)
      throw new Error("Couldn't create funcionario");

    return created;
  }
}
