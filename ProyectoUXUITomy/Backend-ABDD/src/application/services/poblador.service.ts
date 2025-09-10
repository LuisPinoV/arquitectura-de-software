import { Injectable } from '@nestjs/common';
import { CreateAllUseCase } from 'src/domain/use-cases/poblador/poblar-todo.usecase';
import { FichaMedicaRepositoryRegistry } from 'src/presentation/ficha-medica/ficha-medica.registry';
import { MedicoRepositoryRegistry } from 'src/presentation/medico/medico-repo.registry';
import { PacienteRepositoryRegistry } from 'src/presentation/paciente/paciente-repo.registry';
import { TutorRepositoryRegistry } from 'src/presentation/tutor/tutor-repo.registry';
import { DeleteAllUseCase } from 'src/domain/use-cases/poblador/delete-todo.usecase';

@Injectable()
export class PobladorService {
  constructor(
    private readonly pacienteRegistry: PacienteRepositoryRegistry,
    private readonly medicoRegistry: MedicoRepositoryRegistry,
    private readonly tutorRegistry: TutorRepositoryRegistry,
    private readonly fichaRegistry: FichaMedicaRepositoryRegistry,
  ) {}

  async CreateEverything(dbs: string[]) {
    for (let i = 0; i < dbs.length; i++) {
      const curDB = dbs[i];

      const pacienteRepo = this.pacienteRegistry.get(curDB);
      const medicoRepo = this.medicoRegistry.get(curDB);
      const tutorRepo = this.tutorRegistry.get(curDB);
      const fichaRepo = this.fichaRegistry.get(curDB);

      const createAll = new CreateAllUseCase(
        pacienteRepo,
        medicoRepo,
        tutorRepo,
        fichaRepo,
      );

      const quantityPacientes = 30;
      const quantityMedicos = 10;
      const quantityTutores = 15;

      await createAll.execute(
        quantityPacientes,
        quantityMedicos,
        quantityTutores,
      );
    }
  }

  async DeleteEverything(dbs: string[])
  {
    for (let i = 0; i < dbs.length; i++) {
      const curDB = dbs[i];

      const pacienteRepo = this.pacienteRegistry.get(curDB);
      const medicoRepo = this.medicoRegistry.get(curDB);
      const tutorRepo = this.tutorRegistry.get(curDB);
      const fichaRepo = this.fichaRegistry.get(curDB);

      const deleteAll = new DeleteAllUseCase(
        pacienteRepo,
        medicoRepo,
        tutorRepo,
        fichaRepo,
      );

      await deleteAll.execute();
    }

  }
}
