import { CreatePacienteUseCase } from 'src/domain/use-cases/pacientes/create-paciente.usecase';
import { CreatePacienteDto } from 'src/presentation/paciente/dto/create-paciente.dto';
import { Injectable } from '@nestjs/common';
import { PacienteRepositoryRegistry } from 'src/presentation/paciente/paciente-repo.registry';
import { DeleteAllPacientesUseCase } from 'src/domain/use-cases/pacientes/delete-all-pacientes.usecase';
import { ReadAllPacientesUseCase } from 'src/domain/use-cases/pacientes/read-all-pacientes.usecase';
import { ReadPacienteUseCase } from 'src/domain/use-cases/pacientes/read-paciente.usecase';
import { UpdatePacienteUseCase } from 'src/domain/use-cases/pacientes/update-paciente.usecase';
import { UpdatePacienteDto } from 'src/presentation/paciente/dto/update-paciente.dto';
import { DeletePacienteDto } from 'src/presentation/paciente/dto/delete-paciente.dto';
import { DeletePacienteUseCase } from 'src/domain/use-cases/pacientes/delete-paciente.usecase';


@Injectable()
export class PacienteService {
  constructor(private readonly registry: PacienteRepositoryRegistry) {}

  async CreatePaciente(dto: CreatePacienteDto, dbKey:string) {
    const repo = this.registry.get(dbKey);
    const createPaciente = new CreatePacienteUseCase(repo);

    await createPaciente.execute(dto);
  }

  async DeleteAllPacientes(dbKey:string)
  {
    const repo = this.registry.get(dbKey);

    const deleteAllPacientes = new DeleteAllPacientesUseCase(repo);

    await deleteAllPacientes.execute();
  }

  async DeletePaciente(dbKey:string, dto: DeletePacienteDto)
  {
    const repo = this.registry.get(dbKey);

    const deletePaciente = new DeletePacienteUseCase(repo);

    await deletePaciente.execute(dto);
  }

  async FindAllPacientes(dbKey:string):Promise<string>
  {
    const repo = this.registry.get(dbKey);

    const findAllPacientes = new ReadAllPacientesUseCase(repo);

    return await findAllPacientes.execute(); 
  }

  async FindPaciente(dbKey:string, id:string):Promise<string>
  {
    const repo = this.registry.get(dbKey);

    const findPaciente = new ReadPacienteUseCase(repo);

    return await findPaciente.execute(id); 
  }

  async UpdatePaciente(dbKey:string, dto: UpdatePacienteDto)
  {
    const repo = this.registry.get(dbKey);

    const updatePaciente = new UpdatePacienteUseCase(repo);

    await updatePaciente.execute(dto);
  }
}
