import { ITutorRepository } from 'src/domain/repositories/tutor.repository';
import { DeleteTutorDto } from 'src/presentation/tutor/dto/delete-tutor.dto';

export class DeleteTutorUseCase {
  constructor(private readonly pacienteRepo: ITutorRepository) {}

  async execute(dto: DeleteTutorDto) {

    await this.pacienteRepo.DeleteTutor(dto.id);
  }
}
