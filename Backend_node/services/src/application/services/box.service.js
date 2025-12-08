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
import { GetBoxInventarioUseCase } from "../useCases/box/getBoxInventario.useCase.js";
import { GetAllBoxInventariosUseCase } from "../useCases/box/getAllBoxInventarios.useCase.js";
import { UpdateBoxInventarioUseCase } from "../useCases/box/updateBoxInventario.useCase.js";
import { DeleteBoxInventarioUseCase } from "../useCases/box/deleteBoxInventario.useCase.js";

// Repositories
import { boxRepository } from "../../infrastructure/db/box.repository.js";

export class BoxService {
  constructor() {
    this.boxRepository = boxRepository;
  }

  async getBoxes(organizacionId) {
    const getBoxes = new GetBoxesUseCase(this.boxRepository);
    return await getBoxes.execute(organizacionId);
  }

  async getDisponibilidadBox(idBox, fecha, organizacionId) {
    const getOccupancyBox = new GetOccupancyBoxUseCase(this.boxRepository);
    return await getOccupancyBox.execute(idBox, fecha, organizacionId);
  }

  async getOcupacionPorEspecialidad(fecha, hora) {
    const getPercentageOccupancyBySpecialty = new GetPercentageOccupancyBySpecialtyUseCase(this.boxRepository);
    return await getPercentageOccupancyBySpecialty.execute(fecha, hora);
  }

  async getPorcentajeUsoBoxes(fecha, hora) {
    const getBoxesUsagePercentage = new GetBoxesUsagePercentageUseCase(this.boxRepository);
    return await getBoxesUsagePercentage.execute(fecha, hora);
  }

  async getUsoBox(idBox, fecha, hora) {
    const getUsageBox = new GetUsageBoxUseCase(this.boxRepository);
    return await getUsageBox.execute(idBox, fecha, hora);
  }

  async getBox(idBox, organizacionId) {
    const getBox = new GetBoxUseCase(this.boxRepository);
    return await getBox.execute(idBox, organizacionId);
  }

  async createBox(body, organizacionId) {
    if (!body.idBox || !body.especialidad || !body.pasillo || !body.capacidad || !body.nombre)
      throw new Error("Data missing");

    const createBox = new CreateBoxUseCase(this.boxRepository);
    return await createBox.execute({ ...body, organizacionId });
  }

  async updateBox(idBox, updates, organizacionId) {
    const updateBox = new UpdateBoxUseCase(this.boxRepository);
    return await updateBox.execute(idBox, updates, organizacionId);
  }

  async deleteBox(idBox, organizacionId) {
    const deleteBox = new DeleteBoxUseCase(this.boxRepository);
    return await deleteBox.execute(idBox, organizacionId);
  }

  async getAgendamientosByBox(idBox) {
    const agendamientosBox = new GetAgendamientoBoxUseCase(this.boxRepository);
    return await agendamientosBox.execute(idBox);
  }

  async getInventario(idBox, organizacionId) {
    const getInventario = new GetBoxInventarioUseCase(this.boxRepository);
    return await getInventario.execute(idBox, organizacionId);
  }

  async getAllInventarios(organizacionId) {
    const getAllInventarios = new GetAllBoxInventariosUseCase(this.boxRepository);
    return await getAllInventarios.execute(organizacionId);
  }

  async updateInventario(idBox, inventario, organizacionId) {
    const updateInventario = new UpdateBoxInventarioUseCase(this.boxRepository);
    return await updateInventario.execute(idBox, inventario, organizacionId);
  }

  async deleteInventario(idBox, organizacionId) {
    const deleteInventario = new DeleteBoxInventarioUseCase(this.boxRepository);
    return await deleteInventario.execute(idBox, organizacionId);
  }
}
