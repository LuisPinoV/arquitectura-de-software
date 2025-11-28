export class GetOccupancyBoxUseCase {
  constructor(boxRepository) {
    this.boxRepository = boxRepository;
  }

  async execute(idBox, fecha) {
    try {
      const disponibilidad = await this.boxRepository.getDisponibilidadBox(idBox, fecha);
      return disponibilidad;
    } catch (error) {
      throw new Error("Couldn't get box occupancy");
    }
  }
}