//Use cases
import { GetBoxesUseCase } from "../useCases/box/getBoxes.useCase.js";
import { GetOccupancyBoxUseCase } from "../useCases/box/getOccupancyBox.useCase.js";
import { GetPercentageOccupancyBySpecialtyUseCase } from "../useCases/box/getPercentageOccupancyBySpecialty.useCase.js";
import { GetBoxesUsagePercentageUseCase } from "../useCases/box/getBoxesUsagePercentage.useCase.js";
import { GetUsageBoxUseCase } from "../useCases/box/getUsageBox.useCase.js";
import { GetBoxUseCase } from "../useCases/box/getBox.useCase.js";
import { CreateBoxUseCase } from "../useCases/box/createBox.useCase.js";
import { UpdateBoxUseCase } from "../useCases/box/updateBox.useCase.js";
import { DeleteBoxUseCase } from "../useCases/box/deleteBox.useCase.js";
import { GetAgendamientoBoxUseCase } from "../useCases/box/getAgendamientosBox.useCase.js";

// Repositories
import { boxRepository } from "../../infrastructure/db/box.repository.js";

export class BoxService {
  constructor() {
    this.boxRepository = boxRepository;
  }

  async getBoxes() {
    const getBoxes = new GetBoxesUseCase(this.boxRepository);

    return await getBoxes.execute();
  }

  async getOccupancyBox(idBox, date) {
    const getOccupancyBox = new GetOccupancyBoxUseCase(this.boxRepository);

    return await getOccupancyBox.execute(idBox, date);
  }

  async getPercentageOccupancyBySpecialty(date, time) {
    const getPercentageOccupancyBySpecialty =
      new GetPercentageOccupancyBySpecialtyUseCase(this.boxRepository);

    return await getPercentageOccupancyBySpecialty.execute(date, time);
  }

  async getBoxesUsagePercentage(date, time) {
    const getBoxesUsagePercentage = new GetBoxesUsagePercentageUseCase(
      this.boxRepository
    );

    return await getBoxesUsagePercentage.execute(date, time);
  }

  async getUsageBox(idBox, date, time) {
    const getUsageBox = new GetUsageBoxUseCase(this.boxRepository);

    return await getUsageBox.execute(idBox, date, time);
  }

  async getBox(idBox) {
    const getBox = new GetBoxUseCase(this.boxRepository);

    return await getBox.execute(idBox);
  }

  async createBox(body) {
    if (!body.idBox || !body.especialidad || !body.pasillo || !body.capacidad)
      throw new Error("Data missing");
    
    const createBox = new CreateBoxUseCase(this.boxRepository);

    return await createBox.execute(body);
  }

  async updateBox() {
    const updateBox = new UpdateBoxUseCase(this.boxRepository);

    return await updateBox.execute();
  }

  async deleteBox(idBox) {
    const deleteBox = new DeleteBoxUseCase(this.boxRepository);

    return await deleteBox.execute(idBox);
  }

  async getAgendamientosByBox(idBox) {
    const agendamientosBox = new GetAgendamientoBoxUseCase(this.boxRepository);

    return await agendamientosBox.execute(idBox);
  }
}
