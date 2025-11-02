export class GetTiposFuncionariosUseCase {
  constructor(funcionarioRepository) {
    this.funcionarioRepository = funcionarioRepository;
  }

  async execute() {

    const tiposFuncionarios = await this.funcionarioRepository.getTiposFuncionarios();

    if(!tiposFuncionarios) throw new Error("Couldn't get the funcionarios's types");

    return tiposFuncionarios;
  }
}
