import { IMedicoRepository } from "src/domain/repositories/medico.repository";
import { ReadMedicoDto } from "src/presentation/medico/dto/medico-read.dto";

export class ReadAllMedicosUseCase 
{
    constructor(private readonly medicoRepo: IMedicoRepository)
    {}

    async execute()
    {
        const medicos = await this.medicoRepo.FindAll();

        if(medicos === undefined) return "";

        const dtoMedicos:ReadMedicoDto[] = [];

        for(let i = 0; i < medicos.length; i++)
        {
            const curMedico = medicos[i];

            dtoMedicos.push(
                new ReadMedicoDto(
                    curMedico.getId(),
                    curMedico.getNombre(),
                    curMedico.getEstado(),
                    curMedico.getEspecialidad()
                )
            )
        }

        return JSON.stringify(dtoMedicos);
    }
}