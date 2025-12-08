export class GetAllFuncionariosUseCase {
  constructor(funcionarioRepository) {
    this.funcionarioRepository = funcionarioRepository;
  }

  async execute(organizacionId) {
    const funcionarios = await this.funcionarioRepository.getAllFuncionarios(organizacionId);

    if (!funcionarios) {
      throw new Error("Couldn't fetch funcionarios");
    }

    return funcionarios;
  }
}
