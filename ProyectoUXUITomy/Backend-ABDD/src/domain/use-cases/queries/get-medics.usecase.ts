import { IFichaMedicaRepository } from 'src/domain/repositories/ficha-medica.repository';
import { IMedicoRepository } from 'src/domain/repositories/medico.repository';

export class GetMedicsWithNameUseCase {
  constructor(
    private readonly fichaRepository: IFichaMedicaRepository,
    private readonly medicoRepository: IMedicoRepository,
  ) {}
  async execute() {
    const idMedicos = await this.fichaRepository.GetMedicosIDs();

    if (idMedicos === undefined || idMedicos === null) return null;

    const medicos:string[] = [];


    for(let i = 0; i < idMedicos.length; i++)
    {
        const medico = await this.medicoRepository.FindById(idMedicos[i]);

        if(!medico) continue;

        medicos.push(medico.getNombre());
    }

    return medicos;
  }
}
