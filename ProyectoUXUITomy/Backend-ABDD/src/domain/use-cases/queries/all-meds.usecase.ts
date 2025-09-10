import { IFichaMedicaRepository } from 'src/domain/repositories/ficha-medica.repository';

export class AllMedsDBsUseCase {
  constructor(
    private readonly fichaRepository: IFichaMedicaRepository,
  ) {}
  async execute() {
    const meds = await this.fichaRepository.FindMedsWithQuantity();

    if (meds === undefined || meds === null) return null;

    return meds;
  }
}
