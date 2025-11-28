export class GetFuncionariosUseCase {
  constructor(funcionarioRepository) {
    this.funcionarioRepository = funcionarioRepository;
  }

  async execute() {

    const funcionarios = await this.funcionarioRepository.getFuncionarios();


    if(!funcionarios) throw new Error("Couldn't get funcionarios");

    return funcionarios;
  }
}
