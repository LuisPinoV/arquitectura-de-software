import { ITutorRepository } from "src/domain/repositories/tutor.repository";
import { ReadTutorDto } from "src/presentation/tutor/dto/read-tutor.dto";

export class ReadTutorUseCase
{
    constructor(private readonly tutorRepo: ITutorRepository)
    {}

    async execute(id:string)
    {
        const tutor = await this.tutorRepo.FindById(id);

        if(tutor === undefined) return "";

        return JSON.stringify(new ReadTutorDto(
            tutor?.getId(),
            tutor?.getNombre(),
            tutor?.getMascotas()
        ))
    }
}