export class GetPercentageOccupancyBySpecialtyUseCase {
  constructor(boxRepository) {
    this.boxRepository = boxRepository;
  }

  async execute(date, time) {
    const percentageBox =
      await this.boxRepository.getPercentageOccupancyBySpecialtyUseCase(
        date,
        time
      );

    if (!percentageBox)
      throw new Error(
        "Couldn't get box query: percentage occupancy by specialty"
      );

    return percentageBox;
  }
}
