import { ITutorRepository } from "src/domain/repositories/tutor.repository";
import { Tutor } from "src/domain/entities/tutor.entity";
import { v4 as uuidv4 } from 'uuid';
import { CreateTutorDto } from "src/presentation/tutor/dto/create-tutor.dto";

export class CreateTutorUseCase
{
    constructor(private readonly tutorRepo: ITutorRepository)
    {}

    async execute(dto:CreateTutorDto)
    {
        const id = uuidv4();

        const tutor = new Tutor(
            id,
            dto.nombre,
            dto.mascotas
        );

        await this.tutorRepo.CreateTutor(tutor);
    }
}