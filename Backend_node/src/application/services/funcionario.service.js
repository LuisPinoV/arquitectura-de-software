//Use cases
import { CreateFuncionarioUseCase } from "../useCases/funcionario/createFuncionario.useCase";
import { GetAllDataFuncionariosUseCase } from "../useCases/funcionario/getAllDataFuncionarios.useCase";
import { GetFuncionariosUseCase } from "../useCases/funcionario/getFuncionarios.useCase";
import { GetTiposFuncionariosUseCase } from "../useCases/funcionario/getTiposFuncionario.useCase";
import { GetFuncionarioUseCase } from "../useCases/funcionario/getFuncionario.useCase";
import { UpdateFuncionarioUseCase } from "../useCases/funcionario/updateFuncionario.useCase";
import { DeleteFuncionarioUseCase } from "../useCases/funcionario/deleteFuncionario.useCase";
import { GetFuncionarioAgendamientoUseCase } from "../useCases/funcionario/getFuncionarioAgendamiento.useCase";

//Repositories
import { funcionarioRepository } from "../../infrastructure/db/funcionario.repository";

export class FuncionarioService {
  constructor() {
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

  async createFuncionario(body) {
    const createFuncionario = new CreateFuncionarioUseCase(
      this.funcionarioRepository
    );

    return await createFuncionario.execute(body);
  }

  async getFuncionario(idFuncionario) {
    const getFuncionario = new GetFuncionarioUseCase(
      this.funcionarioRepository
    );

    return await getFuncionario.execute(idFuncionario);
  }

  async updateFuncionario(idFuncionario, updates) {
    const updateFuncionario = new UpdateFuncionarioUseCase(
      this.funcionarioRepository
    );

    return await updateFuncionario.execute(idFuncionario, updates);
  }

  async deleteFuncionario(idFuncionario) {
    const deleteFuncionario = new DeleteFuncionarioUseCase(
      this.funcionarioRepository
    );

    return await deleteFuncionario.execute(idFuncionario);
  }

  async getFuncionarioAgendamientos(idFuncionario) {
    const getFuncionarioAgendamiento = new GetFuncionarioAgendamientoUseCase(
      this.funcionarioRepository
    );

    return await getFuncionarioAgendamiento.execute(idFuncionario);
  }
}
