
export class GetFuncionarioUseCase {
  constructor(funcionarioRepository) {
    this.funcionarioRepository = funcionarioRepository;
  }

  async execute(idFuncionario, organizacionId) {
    const funcionario = await this.funcionarioRepository.getFuncionario(idFuncionario, organizacionId);

    if (!funcionario) {
      throw new Error("Funcionario no encontrado");
    }

    return funcionario;
  }
}