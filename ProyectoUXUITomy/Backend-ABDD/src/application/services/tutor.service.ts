import { Injectable } from '@nestjs/common';
import { CreateTutorDto } from 'src/presentation/tutor/dto/create-tutor.dto';
import { TutorRepositoryRegistry } from 'src/presentation/tutor/tutor-repo.registry';
import { CreateTutorUseCase } from 'src/domain/use-cases/tutor/create-tutor.usecase';
import { DeleteAllTutoresUseCase } from 'src/domain/use-cases/tutor/delete-all-tutores.usecase';
import { ReadTutorUseCase } from 'src/domain/use-cases/tutor/read-tutor.usecase';
import { ReadAllTutoresUseCase } from 'src/domain/use-cases/tutor/read-all-tutores.usecase';
import { UpdateTutorDto } from 'src/presentation/tutor/dto/update-tutor.dto';
import { UpdateTutorUseCase } from 'src/domain/use-cases/tutor/update-tutor.usecase';
import { DeleteTutorDto } from 'src/presentation/tutor/dto/delete-tutor.dto';
import { DeleteTutorUseCase } from 'src/domain/use-cases/tutor/delete-tutor.usercase';

@Injectable()
export class TutorService {
  constructor(private readonly registry: TutorRepositoryRegistry) {}

  async CreateTutor(dto: CreateTutorDto, dbKey: string) {
    const repo = this.registry.get(dbKey);
    const createTutor = new CreateTutorUseCase(repo);

    await createTutor.execute(dto);
  }

  async DeleteAllTutores(dbKey: string) {
    const repo = this.registry.get(dbKey);
    const deleteTutor = new DeleteAllTutoresUseCase(repo);

    await deleteTutor.execute();
  }

  async DeleteTutor(dbKey: string, dto: DeleteTutorDto) {
    const repo = this.registry.get(dbKey);

    const deleteTutor = new DeleteTutorUseCase(repo);

    await deleteTutor.execute(dto);
  }

  async FindTutor(dbKey: string, id: string) {
    const repo = this.registry.get(dbKey);

    const findTutor = new ReadTutorUseCase(repo);

    return await findTutor.execute(id);
  }

  async FindAllTutores(dbKey: string) {
    const repo = this.registry.get(dbKey);

    const findAllTutores = new ReadAllTutoresUseCase(repo);

    return await findAllTutores.execute();
  }

  async UpdateTutor(dbKey: string, dto: UpdateTutorDto) {
    const repo = this.registry.get(dbKey);

    const updateTutor = new UpdateTutorUseCase(repo);

    await updateTutor.execute(dto);
  }
}
