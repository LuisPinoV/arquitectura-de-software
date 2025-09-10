import { ITutorRepository } from 'src/domain/repositories/tutor.repository';
import { Tutor } from 'src/domain/entities/tutor.entity';
import { UpdateTutorDto } from 'src/presentation/tutor/dto/update-tutor.dto';

export class UpdateTutorUseCase {
  constructor(private readonly tutorRepo: ITutorRepository) {}

  async execute(dto:UpdateTutorDto) {

    const tutor = await this.tutorRepo.FindById(dto.id);

    if(!tutor)
    {
      console.log("Tutor wasn't found");
      return null;
    }

    tutor.UpdateData(dto.nombre, dto.mascotas);

    await this.tutorRepo.UpdateTutor(tutor);
  }
}
