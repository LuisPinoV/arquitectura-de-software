// agendamiento.service.js - VERSIÓN CORREGIDA
import { GetAgendamientoUseCase } from "../useCases/agendamiento/getAgendamiento.useCase.js";
import { GetAllAgendamientosUseCase } from "../useCases/agendamiento/getAllAgendamientos.useCase.js"; 
import { GetAgendamientoCompletoUseCase } from "../useCases/agendamiento/getAgendamientoCompleto.useCase.js";
import { CreateAgendamientoUseCase } from "../useCases/agendamiento/createAgendamiento.useCase.js";
import { UpdateAgendamientoUseCase } from "../useCases/agendamiento/updateAgendamiento.useCase.js";
import { DeleteAgendamientoUseCase } from "../useCases/agendamiento/deleteAgendamiento.useCase.js";
import { GetAgendamientosByPacienteUseCase } from "../useCases/agendamiento/getAgendamientosByPaciente.useCase.js";
import { GetAgendamientosByFuncionarioUseCase } from "../useCases/agendamiento/getAgendamientosByFuncionario.useCase.js";
import { GetAgendamientosByBoxUseCase } from "../useCases/agendamiento/getAgendamientosByBox.useCase.js";
import { GetAgendamientosByFechaUseCase } from "../useCases/agendamiento/getAgendamientosByFecha.useCase.js";
import { GetAgendamientosByEspecialidadUseCase } from "../useCases/agendamiento/getAgendamientosByEspecialidad.useCase.js";
import { GetCountAgendamientosPorEspecialidadUseCase } from "../useCases/agendamiento/getCountAgendamientosPorEspecialidad.useCase.js";
import { GetCountAgendamientosPorEspecialidadRangoFechasUseCase } from "../useCases/agendamiento/getCountAgendamientosPorEspecialidadRangoFechas.useCase.js"; // ← Corregir nombre
import { GetPorcentajeOcupacionPorEspecialidadUseCase } from "../useCases/agendamiento/getPorcentajeOcupacionPorEspecialidad.useCase.js";
import { GetEstadosAgendamientoUseCase } from "../useCases/agendamiento/getEstadosAgendamiento.useCase.js";
import { AddEstadoAgendamientoUseCase } from "../useCases/agendamiento/addEstadoAgendamiento.useCase.js";
import { GetResultadoConsultaUseCase } from "../useCases/agendamiento/getResultadoConsulta.useCase.js";

// Repositories
import { agendamientoRepository } from "../../infrastructure/db/agendamiento.repository.js";

export class AgendamientoService {
  constructor() {
    this.agendamientoRepository = agendamientoRepository;
  }

  async getAgendamiento(idConsulta) {
    const getAgendamiento = new GetAgendamientoUseCase(this.agendamientoRepository);
    return await getAgendamiento.execute(idConsulta);
  }

  async getAllAgendamientos() {
    const getAllAgendamientos = new GetAllAgendamientosUseCase(this.agendamientoRepository);
    return await getAllAgendamientos.execute();
  }

  async createAgendamiento(body) {
    if (!body.idConsulta || !body.idPaciente || !body.idFuncionario || !body.idBox || !body.fecha || !body.horaEntrada)
      throw new Error("Data missing");
    
    const createAgendamiento = new CreateAgendamientoUseCase(this.agendamientoRepository);
    return await createAgendamiento.execute(body);
  }

  async updateAgendamiento(idConsulta, updates) {
    const updateAgendamiento = new UpdateAgendamientoUseCase(this.agendamientoRepository);
    return await updateAgendamiento.execute(idConsulta, updates);
  }

  async deleteAgendamiento(idConsulta) {
    const deleteAgendamiento = new DeleteAgendamientoUseCase(this.agendamientoRepository);
    return await deleteAgendamiento.execute(idConsulta);
  }

  async getAgendamientosByPaciente(idPaciente) {
    const getAgendamientosByPaciente = new GetAgendamientosByPacienteUseCase(this.agendamientoRepository);
    return await getAgendamientosByPaciente.execute(idPaciente);
  }

  async getAgendamientosByFuncionario(idFuncionario) {
    const getAgendamientosByFuncionario = new GetAgendamientosByFuncionarioUseCase(this.agendamientoRepository);
    return await getAgendamientosByFuncionario.execute(idFuncionario);
  }

  async getAgendamientosByBox(idBox) {
    const getAgendamientosByBox = new GetAgendamientosByBoxUseCase(this.agendamientoRepository);
    return await getAgendamientosByBox.execute(idBox);
  }

  async getAgendamientosByFecha(fecha) {
    const getAgendamientosByFecha = new GetAgendamientosByFechaUseCase(this.agendamientoRepository);
    return await getAgendamientosByFecha.execute(fecha);
  }

  async getAgendamientosByEspecialidad(especialidadNombre) {
    const getAgendamientosByEspecialidad = new GetAgendamientosByEspecialidadUseCase(this.agendamientoRepository);
    return await getAgendamientosByEspecialidad.execute(especialidadNombre);
  }

  async getCountAgendamientosPorEspecialidad() {
    const useCase = new GetCountAgendamientosPorEspecialidadUseCase(this.agendamientoRepository);
    return await useCase.execute();
  }

  async getCountAgendamientosPorEspecialidadRangoFechas(fechaInicio, fechaFin) {
    const useCase = new GetCountAgendamientosPorEspecialidadRangoFechasUseCase(this.agendamientoRepository);
    return await useCase.execute(fechaInicio, fechaFin);
  }

  async getPorcentajeOcupacionPorEspecialidad(fechaInicio, fechaFin) {
    const useCase = new GetPorcentajeOcupacionPorEspecialidadUseCase(this.agendamientoRepository);
    return await useCase.execute(fechaInicio, fechaFin);
  }

  async getEstadosAgendamiento(idConsulta) {
    const getEstadosAgendamiento = new GetEstadosAgendamientoUseCase(this.agendamientoRepository);
    return await getEstadosAgendamiento.execute(idConsulta);
  }

  async addEstadoAgendamiento(idConsulta, estado) {
    const addEstadoAgendamiento = new AddEstadoAgendamientoUseCase(this.agendamientoRepository);
    return await addEstadoAgendamiento.execute(idConsulta, estado);
  }

  async getResultadoConsulta(idConsulta) {
    const getResultadoConsulta = new GetResultadoConsultaUseCase(this.agendamientoRepository);
    return await getResultadoConsulta.execute(idConsulta);
  }

  async getAgendamientoCompleto(idConsulta) {
    const getAgendamientoCompleto = new GetAgendamientoCompletoUseCase(this.agendamientoRepository);
    return await getAgendamientoCompleto.execute(idConsulta);
  }
}