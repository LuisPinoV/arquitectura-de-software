import { IFichaMedicaRepository } from 'src/domain/repositories/ficha-medica.repository';
import { IMedicoRepository } from 'src/domain/repositories/medico.repository';
import { IPacienteRepository } from 'src/domain/repositories/paciente.repository';
import { ITutorRepository } from 'src/domain/repositories/tutor.repository';

export class DeleteAllUseCase {
  constructor(
    private readonly pacienteRepository: IPacienteRepository,
    private readonly medicoRepository: IMedicoRepository,
    private readonly tutorRepository: ITutorRepository,
    private readonly fichaRepository: IFichaMedicaRepository,
  ) {}

  async execute()
  {
    await this.pacienteRepository.DeleteAll();
    await this.medicoRepository.DeleteAll();
    await this.tutorRepository.DeleteAll();
    await this.fichaRepository.DeleteAll();
  }
}