export class GetUsageBoxUseCase {
  constructor(boxRepository) {
    this.boxRepository = boxRepository;
  }

  async execute(date, time) {

    const getUsageBox = await this.boxRepository.getUsageBox(idBox, date, time);

    if(!getUsageBox) throw new Error("Couldn't get usage box");

    return getUsageBox; 
  }
}
