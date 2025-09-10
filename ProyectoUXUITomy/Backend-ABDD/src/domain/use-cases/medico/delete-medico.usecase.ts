import { IMedicoRepository } from "src/domain/repositories/medico.repository";
import { DeleteMedicoDto } from "src/presentation/medico/dto/medico-delete.dto";

export class DeleteMedicoUseCase 
{
    constructor(private readonly medicoRepo: IMedicoRepository)
    {}

    async execute(dto: DeleteMedicoDto)
    {
        await this.medicoRepo.DeleteMedico(dto.id);
    }
}