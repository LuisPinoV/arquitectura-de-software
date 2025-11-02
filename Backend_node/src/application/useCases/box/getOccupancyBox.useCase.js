export class GetOccupancyBoxUseCase {
  constructor(boxRepository) {
    this.boxRepository = boxRepository;
  }

  async execute(idBox, date) {

    const occupancyBox = await this.boxRepository.getOccupancyBox(idBox, date);

    if(!occupancyBox) throw new Error("Couldn't get occupancy of box");

    return occupancyBox;
  }
}
