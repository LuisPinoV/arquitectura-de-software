import { IFichaMedicaRepository } from "src/domain/repositories/ficha-medica.repository";

export class DeleteAllFichasUseCase 
{
    constructor(private readonly fichaRepo: IFichaMedicaRepository)
    {}

    async execute()
    {
        await this.fichaRepo.DeleteAll();
    }
}