export class GetUsageBoxUseCase {
  constructor(boxRepository) {
    this.boxRepository = boxRepository;
  }

  async execute(idBox, fecha, hora) {
    try {
      const uso = await this.boxRepository.getUsoBox(idBox, fecha, hora);
      return uso;
    } catch (error) {
      throw new Error("Couldn't get box usage");
    }
  }
}