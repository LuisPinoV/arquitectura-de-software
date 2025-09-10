import { IPacienteRepository } from '../../repositories/paciente.repository';
import { ReadPacienteDto } from 'src/presentation/paciente/dto/read-paciente.dto';

export class ReadAllPacientesUseCase {
  constructor(private readonly pacienteRepo: IPacienteRepository) {}

  async execute() {

    const pacientes = await this.pacienteRepo.FindAll();

    if(pacientes === undefined) return "";

    const dtoPacientes:ReadPacienteDto[] = [];

    for(let i = 0; i < pacientes.length; i++)
    {
      const curPaciente = pacientes[i];

      dtoPacientes.push(
        new ReadPacienteDto(
          curPaciente.getId(),
          curPaciente.getNombre(),
          curPaciente.getTutor(),
          curPaciente.getRaza(),
          curPaciente.getEdad(),
          curPaciente.getEspecie(),
          curPaciente.getGenero()
        )
      )
    }

    return JSON.stringify(dtoPacientes);
  }
}