import { IFichaMedicaRepository } from 'src/domain/repositories/ficha-medica.repository';

export class GetProceduresAndMoneyFichaMedicaUseCase {
  constructor(private readonly fichaMedicaRepo: IFichaMedicaRepository) {}

  async execute() {
    const procedimientos = await this.fichaMedicaRepo.FindAllProceduresMoney();

    if (procedimientos === undefined) return null;

    return procedimientos;
  }
}
