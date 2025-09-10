import { ITutorRepository } from "src/domain/repositories/tutor.repository";

export class AveragePetsUseCase {
  constructor(private readonly tutorRepo: ITutorRepository) {}

  async execute() {
    const mascotas = await this.tutorRepo.MascotasTotales();

    if (mascotas === undefined) return null;

    return mascotas;
  }
}
