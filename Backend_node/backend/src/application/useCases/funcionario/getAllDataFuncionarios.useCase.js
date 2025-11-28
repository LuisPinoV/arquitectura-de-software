export class GetAllDataFuncionariosUseCase {
  constructor(funcionarioRepository) {
    this.funcionarioRepository = funcionarioRepository;
  }

  async execute() {

    const allDataFuncionarios = await this.funcionarioRepository.getAllDataFuncionarios();

    if(!allDataFuncionarios) throw new Error("Couldn't get all the data from the funcionarios");
    
    return allDataFuncionarios;
  }
}
