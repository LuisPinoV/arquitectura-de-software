import { IMedicoRepository } from "src/domain/repositories/medico.repository";
import { UpdateMedicoDto } from "src/presentation/medico/dto/medico-update.dto";

export class UpdateMedicoUseCase 
{
    constructor(private readonly medicoRepo: IMedicoRepository)
    {}

    async execute(dto: UpdateMedicoDto)
    {
        const medico = await this.medicoRepo.FindById(dto.id);

        if(!medico)
        {
        console.log("Medico wasn't found");
        return null;
        }

        medico.UpdateData(dto.nombre, dto.estado, dto.especialidad);

        await this.medicoRepo.UpdateMedico(medico);

    }
}