import { ITutorRepository } from 'src/domain/repositories/tutor.repository';
import { ReadTutorDto } from 'src/presentation/tutor/dto/read-tutor.dto';

export class ReadAllTutoresUseCase {
  constructor(private readonly tutorRepo: ITutorRepository) {}

  async execute() {

    const tutores = await this.tutorRepo.FindAll();

    if(tutores === undefined) return "";

    const dtoTutores:ReadTutorDto[] = [];

    for(let i = 0; i < tutores.length; i++)
    {
      const curTutor = tutores[i];

      dtoTutores.push(
        new ReadTutorDto(
          curTutor.getId(),
          curTutor.getNombre(),
          curTutor.getMascotas()
        )
      )
    }

    return JSON.stringify(dtoTutores);
  }
}