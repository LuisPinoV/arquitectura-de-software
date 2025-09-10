import { IFichaMedicaRepository } from 'src/domain/repositories/ficha-medica.repository';

export class MostUsedVaccinesUseCase {
  constructor(private readonly fichaMedicaRepo: IFichaMedicaRepository) {}

  async execute() {
    const vacunas = await this.fichaMedicaRepo.FindAllVaccines();

    if (vacunas === undefined) return null;

    return vacunas;
  }
}
