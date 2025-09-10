import { IMedicoRepository } from "src/domain/repositories/medico.repository";

export class DeleteAllMedicosUseCase 
{
    constructor(private readonly medicoRepo: IMedicoRepository)
    {}

    async execute()
    {
        await this.medicoRepo.DeleteAll();
    }
}