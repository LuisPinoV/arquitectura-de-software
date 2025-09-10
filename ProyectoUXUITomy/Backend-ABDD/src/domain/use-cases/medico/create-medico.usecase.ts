import { IMedicoRepository } from "src/domain/repositories/medico.repository";
import { Medico } from "src/domain/entities/medico.entity";
import { CreateMedicoDto } from "src/presentation/medico/dto/medico-create.dto";
import { v4 as uuidv4 } from 'uuid';

export class CreateMedicoUseCase 
{
    constructor(private readonly medicoRepo: IMedicoRepository)
    {}

    async execute(dto:CreateMedicoDto)
    {
        const id = uuidv4();
        const estado = "Disponible";

        const medico = new Medico(
            id,
            dto.nombre,
            estado,
            dto.especialidad
        )

        await this.medicoRepo.CreateMedico(medico);
    }
}