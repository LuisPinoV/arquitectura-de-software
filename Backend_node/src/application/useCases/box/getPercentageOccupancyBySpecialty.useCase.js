export class GetPercentageOccupancyBySpecialtyUseCase {
  constructor(boxRepository) {
    this.boxRepository = boxRepository;
  }

  async execute(fecha, hora) {
    try {
      const ocupacion = await this.boxRepository.getOcupacionPorEspecialidad(fecha, hora);
      return ocupacion;
    } catch (error) {
      throw new Error("Couldn't get occupancy by specialty");
    }
  }
}