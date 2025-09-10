import { IPacienteRepository } from '../../repositories/paciente.repository';

export class DeleteAllPacientesUseCase {
  constructor(private readonly pacienteRepo: IPacienteRepository) {}

  async execute() {

    await this.pacienteRepo.DeleteAll();
  }
}
