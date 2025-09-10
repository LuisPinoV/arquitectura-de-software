import { Injectable } from '@nestjs/common';
import { CreateMedicoDto } from 'src/presentation/medico/dto/medico-create.dto';
import { MedicoRepositoryRegistry } from 'src/presentation/medico/medico-repo.registry';
import { CreateMedicoUseCase } from 'src/domain/use-cases/medico/create-medico.usecase';
import { DeleteAllMedicosUseCase } from 'src/domain/use-cases/medico/delete-all-medicos.usecase';
import { DeleteMedicoDto } from 'src/presentation/medico/dto/medico-delete.dto';
import { DeleteMedicoUseCase } from 'src/domain/use-cases/medico/delete-medico.usecase';
import { ReadAllMedicosUseCase } from 'src/domain/use-cases/medico/read-all-medicos.usecase';
import { UpdateMedicoDto } from 'src/presentation/medico/dto/medico-update.dto';
import { UpdateMedicoUseCase } from 'src/domain/use-cases/medico/update-medico.usecase';
import { ReadMedicoUseCase } from 'src/domain/use-cases/medico/read-medico.usecase';

@Injectable()
export class MedicoService {
  constructor(private readonly registry: MedicoRepositoryRegistry) {}

  async CreateMedico(dto: CreateMedicoDto, dbKey: string) {
    const repo = this.registry.get(dbKey);
    const createTutor = new CreateMedicoUseCase(repo);

    await createTutor.execute(dto);
  }

  async DeleteAllMedicos(dbKey: string) {
    const repo = this.registry.get(dbKey);

    const deleteAllMedicos = new DeleteAllMedicosUseCase(repo);

    await deleteAllMedicos.execute();
  }

  async DeleteMedico(dbKey: string, dto: DeleteMedicoDto) {
    const repo = this.registry.get(dbKey);

    const deleteMedico = new DeleteMedicoUseCase(repo);

    await deleteMedico.execute(dto);
  }

  async FindAllMedicos(dbKey: string): Promise<string> {
    const repo = this.registry.get(dbKey);

    const findAllMedicos = new ReadAllMedicosUseCase(repo);

    return await findAllMedicos.execute();
  }

  async FindMedico(dbKey: string, id: string): Promise<string> {
    const repo = this.registry.get(dbKey);

    const findMedico = new ReadMedicoUseCase(repo);

    return await findMedico.execute(id);
  }

  async UpdateMedico(dbKey: string, dto: UpdateMedicoDto) {
    const repo = this.registry.get(dbKey);

    const updateMedico = new UpdateMedicoUseCase(repo);

    await updateMedico.execute(dto);
  }
}
