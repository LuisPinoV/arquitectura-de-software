import { IPacienteRepository } from '../../repositories/paciente.repository';
import { ReadPacienteDto } from 'src/presentation/paciente/dto/read-paciente.dto';

export class ReadPacienteUseCase {
  constructor(private readonly pacienteRepo: IPacienteRepository) {}

  async execute(id:string) 
  {
    const paciente = await this.pacienteRepo.FindById(id);

    if(paciente === undefined) return "";

    return JSON.stringify(new ReadPacienteDto
        (
          paciente?.getId(),
          paciente?.getNombre(),
          paciente?.getTutor(),
          paciente?.getRaza(),
          paciente?.getEdad(),
          paciente?.getEspecie(),
          paciente?.getGenero()
        )
      );
  }
}