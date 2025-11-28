export class GetBoxesUsagePercentageUseCase {
  constructor(boxRepository) {
    this.boxRepository = boxRepository;
  }

  async execute(fecha, hora) {
    try {
      const porcentaje = await this.boxRepository.getPorcentajeUsoBoxes(fecha, hora);
      return porcentaje;
    } catch (error) {
      throw new Error("Couldn't get boxes usage percentage");
    }
  }
}