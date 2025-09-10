import { SerializableReadFichaMedica } from 'src/domain/entities/ficha-medica.entity';
import { IFichaMedicaRepository } from 'src/domain/repositories/ficha-medica.repository';

export class ReadAllFichaMedicaUseCase {
  constructor(private readonly fichaMedicaRepo: IFichaMedicaRepository) {}

  async execute() {
    const fichas = await this.fichaMedicaRepo.FindAll();

    if (fichas === undefined) return '';

    const dtoFichas: SerializableReadFichaMedica[] = [];

    for (let i = 0; i < fichas.length; i++) {
      const curFicha = fichas[i];

      dtoFichas.push(curFicha.getSerializableFichaMedica());
    }
    return JSON.stringify(dtoFichas);
  }
}
