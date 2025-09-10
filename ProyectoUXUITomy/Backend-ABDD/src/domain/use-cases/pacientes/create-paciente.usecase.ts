import { IPacienteRepository } from '../../repositories/paciente.repository';
import { Paciente } from '../../entities/paciente.entity';
import { CreatePacienteDto } from 'src/presentation/paciente/dto/create-paciente.dto';
import { v4 as uuidv4 } from 'uuid';

export class CreatePacienteUseCase {
  constructor(private readonly pacienteRepo: IPacienteRepository) {}

  async execute(dto:CreatePacienteDto) {
    const id = uuidv4();

    const paciente = new Paciente(
      id,
      dto.tutor,
      dto.nombre,
      dto.raza,
      dto.edad,
      dto.especie,
      dto.genero,
    );

    await this.pacienteRepo.CreatePaciente(paciente);
  }
}
