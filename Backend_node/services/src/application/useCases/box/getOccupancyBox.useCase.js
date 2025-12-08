export class GetOccupancyBoxUseCase {
  constructor(boxRepository) {
    this.boxRepository = boxRepository;
  }

  async execute(idBox, fecha, organizacionId) {
    const disponibilidad = await this.boxRepository.getDisponibilidadBox(idBox, fecha, organizacionId);
    return disponibilidad;
  }
}