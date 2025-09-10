import { DeleteFichaMedicaDto } from "src/presentation/ficha-medica/dto/delete-ficha-medica.dto";
import { IFichaMedicaRepository } from "src/domain/repositories/ficha-medica.repository";

export class DeleteFichaMedicaUseCase 
{
    constructor(private readonly fichaRepo: IFichaMedicaRepository)
    {}

    async execute(dto: DeleteFichaMedicaDto)
    {
        await this.fichaRepo.DeleteFicha(dto.id);
    }
}