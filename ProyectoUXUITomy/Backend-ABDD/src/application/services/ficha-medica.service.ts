import { Injectable } from '@nestjs/common';
import { CreateFichaMedicaDto } from 'src/presentation/ficha-medica/dto/create-ficha-medica.dto';
import { FichaMedicaRepositoryRegistry } from 'src/presentation/ficha-medica/ficha-medica.registry';
import { CreateFichaMedicaUseCase } from 'src/domain/use-cases/ficha-medica/create-ficha.usecase';
import { DeleteAllFichasUseCase } from 'src/domain/use-cases/ficha-medica/delete-all-fichas.usecase';
import { ReadAllFichaMedicaUseCase } from 'src/domain/use-cases/ficha-medica/read-all-ficha.usecase';
import { ReadFichaMediaUseCase } from 'src/domain/use-cases/ficha-medica/read-ficha.usecase';
import { DeleteFichaMedicaDto } from 'src/presentation/ficha-medica/dto/delete-ficha-medica.dto';
import { DeleteFichaMedicaUseCase } from 'src/domain/use-cases/ficha-medica/delete-ficha.usecase';
import { UpdateFichaMedicaDto } from 'src/presentation/ficha-medica/dto/update-ficha-medica.dto';
import { UpdateFichaMedicaUseCase } from 'src/domain/use-cases/ficha-medica/update-ficha.usecase';

@Injectable()
export class FichaMedicaService {
  constructor(private readonly registry: FichaMedicaRepositoryRegistry) {}

  async CreateFichaMedica(dto: CreateFichaMedicaDto, dbKey: string) {
    const repo = this.registry.get(dbKey);
    const createFichaMedica = new CreateFichaMedicaUseCase(repo);

    await createFichaMedica.execute(dto);
  }

  async DeleteFichaMedica(dbKey: string, dto: DeleteFichaMedicaDto) {
      const repo = this.registry.get(dbKey);
      const deleteFicha = new DeleteFichaMedicaUseCase(repo);
  
      await deleteFicha.execute(dto);
    }

  async DeleteAllFichasMedicas(dbKey: string) {
    const repo = this.registry.get(dbKey);
    const deleteFichas = new DeleteAllFichasUseCase(repo);

    await deleteFichas.execute();
  }

  async FindAllFichasMedicas(dbKey: string) {
    const repo = this.registry.get(dbKey);

    const findAllFichas = new ReadAllFichaMedicaUseCase(repo);

    return await findAllFichas.execute();
  }

  async FindFichaMedica(dbKey: string, id: string): Promise<string> {
      const repo = this.registry.get(dbKey);
  
      const findFicha = new ReadFichaMediaUseCase(repo);
  
      return await findFicha.execute(id);
    }

  async UpdateFichaMedica(dbKey: string, dto: UpdateFichaMedicaDto) {
      const repo = this.registry.get(dbKey);
  
      const updateFicha = new UpdateFichaMedicaUseCase(repo);
  
      await updateFicha.execute(dto);
    }
}
