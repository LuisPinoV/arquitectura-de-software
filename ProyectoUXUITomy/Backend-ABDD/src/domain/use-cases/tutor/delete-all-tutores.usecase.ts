import { ITutorRepository } from "src/domain/repositories/tutor.repository";

export class DeleteAllTutoresUseCase {
  constructor(private readonly pacienteRepo: ITutorRepository) {}

  async execute() {

    await this.pacienteRepo.DeleteAll();
  }
}
