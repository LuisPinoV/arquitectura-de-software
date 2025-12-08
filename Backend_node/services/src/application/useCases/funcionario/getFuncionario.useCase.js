
export class GetFuncionarioUseCase {
  constructor(funcionarioRepository) {
    this.funcionarioRepository = funcionarioRepository;
  }

  async execute(idFuncionario) {
    const funcionario = await this.funcionarioRepository.getFuncionario(idFuncionario);

    if (!funcionario) {
      throw new Error("Funcionario no encontrado");
    }

    return funcionario;
  }
}