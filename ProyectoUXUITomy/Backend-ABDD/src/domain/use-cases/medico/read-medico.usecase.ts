import { IMedicoRepository } from "src/domain/repositories/medico.repository";
import { ReadMedicoDto } from "src/presentation/medico/dto/medico-read.dto";

export class ReadMedicoUseCase 
{
    constructor(private readonly medicoRepo: IMedicoRepository)
    {}

    async execute(id:string)
    {
        const medico = await this.medicoRepo.FindById(id);

        if(medico === undefined) return "";

        return JSON.stringify(
            new ReadMedicoDto(
                medico?.getId(),
                medico?.getNombre(),
                medico?.getEstado(),
                medico?.getEspecialidad()
            )
        )
    }
}