import { IFichaMedicaRepository } from "src/domain/repositories/ficha-medica.repository";
import { UpdateFichaMedicaDto } from "src/presentation/ficha-medica/dto/update-ficha-medica.dto";

export class UpdateFichaMedicaUseCase 
{
    constructor(private readonly fichaRepo: IFichaMedicaRepository)
    {}

    async execute(dto: UpdateFichaMedicaDto)
    {
        const ficha = await this.fichaRepo.FindById(dto.id);

        if(!ficha)
        {
        console.log("Ficha Medica wasn't found");
        return null;
        }

        ficha.UpdateData(dto.idMascota, dto.revisionesMedicas, dto.carnetVacuna);

        await this.fichaRepo.UpdateFicha(ficha);

    }
}