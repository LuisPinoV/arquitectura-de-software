export class GetAllFuncionariosUseCase {
  constructor(funcionarioRepository) {
    this.funcionarioRepository = funcionarioRepository;
  }

  async execute() {
    const funcionarios = await this.funcionarioRepository.getAllFuncionarios();

    if (!funcionarios) {
      throw new Error("Couldn't fetch funcionarios");
    }

    return funcionarios;
  }
}
