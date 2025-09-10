import { IFichaMedicaRepository } from "src/domain/repositories/ficha-medica.repository";
import { FichaMedica } from "src/domain/entities/ficha-medica.entity";
import { CreateFichaMedicaDto } from "src/presentation/ficha-medica/dto/create-ficha-medica.dto";
import { v4 as uuidv4 } from 'uuid';

export class CreateFichaMedicaUseCase
{
    constructor(private readonly fichaMedicaRepo: IFichaMedicaRepository)
    {}

    async execute(dto: CreateFichaMedicaDto)
    {
        const id = uuidv4();

        const ficha = new FichaMedica(
            id,
            dto.idMascota,
            dto.revisionesMedicas,
            dto.carnetVacuna
        );

        await this.fichaMedicaRepo.CreateFicha(ficha);
    }

}