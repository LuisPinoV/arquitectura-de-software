import { IFichaMedicaRepository } from 'src/domain/repositories/ficha-medica.repository';
import { IPacienteRepository } from 'src/domain/repositories/paciente.repository';

export class FindPetAllDBsUseCase {
  constructor(
    private readonly fichaRepository: IFichaMedicaRepository,
    private readonly pacienteRepository: IPacienteRepository,
  ) {}
  async execute(idMascota: string) {
    const ficha = await this.fichaRepository.FindByPetId(idMascota);

    if (ficha === undefined || ficha === null) return null;

    const paciente = await this.pacienteRepository.FindById(idMascota);

    return {
      nombreMascota: paciente?.getNombre(),
      RevisionesMedicas: ficha.getRevisionesMedicas(),
    }
  }
}
