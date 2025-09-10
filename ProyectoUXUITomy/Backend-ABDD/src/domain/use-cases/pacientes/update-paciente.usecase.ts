import { IPacienteRepository } from '../../repositories/paciente.repository';
import { UpdatePacienteDto } from 'src/presentation/paciente/dto/update-paciente.dto';

export class UpdatePacienteUseCase {
  constructor(private readonly pacienteRepo: IPacienteRepository) {}

  async execute(dto:UpdatePacienteDto) {

    const paciente = await this.pacienteRepo.FindById(dto.id);


    if(!paciente)
    {
      console.log("Patient wasn't found");
      return null;
    }

    paciente.UpdateData(dto.tutor, dto.nombre, dto.raza, dto.edad, dto.especie);

    await this.pacienteRepo.UpdatePaciente(paciente);
  }
}
