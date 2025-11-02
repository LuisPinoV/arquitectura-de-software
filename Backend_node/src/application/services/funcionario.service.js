//Use cases
import { GetAllDataFuncionariosUseCase } from "../useCases/funcionario/getAllDataFuncionarios.useCase";
import { GetFuncionariosUseCase } from "../useCases/funcionario/getFuncionarios.useCase";
import { GetTiposFuncionariosUseCase } from "../useCases/funcionario/getTiposFuncionario.useCase";

export class BoxService {
  constructor(funcionarioRepository) {
    this.funcionarioRepository = funcionarioRepository;
  }

  async getFuncionarios() {
    const getFuncionarios = new GetFuncionariosUseCase(
      this.funcionarioRepository
    );

    return await getFuncionarios.execute();
  }

  async getAllDataFuncionarios() {
    const getAllDataFuncionarios = new GetAllDataFuncionariosUseCase(
      this.funcionarioRepository
    );

    return await getAllDataFuncionarios.execute();
  }

  async getTiposFuncionarios() {
    const getTiposFuncionarios = new GetTiposFuncionariosUseCase(
      this.funcionarioRepository
    );

    return await getTiposFuncionarios.execute();
  }
}
