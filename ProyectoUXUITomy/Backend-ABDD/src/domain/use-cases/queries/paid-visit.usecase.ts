import { IFichaMedicaRepository } from 'src/domain/repositories/ficha-medica.repository';

export class PaidVisitsUseCase {
  constructor(private readonly fichaMedicaRepo: IFichaMedicaRepository) {}

  async execute() {
    const pagados = await this.fichaMedicaRepo.GetRevisionesPagos();

    if (pagados === undefined) return null;

    return pagados;
  }
}
