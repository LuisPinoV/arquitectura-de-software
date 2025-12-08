//Use cases

import { CreateAgendamientoUsuarioUseCase } from "../useCases/usuario/createAgendamiento.useCase.js";
import { CreateUsuarioUseCase } from "../useCases/usuario/createUsuario.useCase.js";
import { DeleteUsuarioUseCase } from "../useCases/usuario/deleteUsuario.useCase.js";
import { GetUsuarioUseCase } from "../useCases/usuario/getUsuario.useCase.js";
import { GetUsuarioAgendamientoUseCase } from "../useCases/usuario/getUsuarioAgendamiento.useCase.js";
import { GetUsuariosUseCase } from "../useCases/usuario/getUsuarios.useCase.js";
import { UpdateUsuarioUseCase } from "../useCases/usuario/updateUsuario.useCase.js";



export class UsuarioService {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async getUsuarios(organizacionId) {
    const getUsuarios = new GetUsuariosUseCase(this.usuarioRepository);

    return await getUsuarios.execute(organizacionId);
  }

  async getUsuario(idUsuario, organizacionId) {
    const getUsuario = new GetUsuarioUseCase(this.usuarioRepository);

    return await getUsuario.execute(idUsuario, organizacionId);
  }

  async createUsuario(body, organizacionId) {
    const createUsuario = new CreateUsuarioUseCase(this.usuarioRepository);

    return await createUsuario.execute({ ...body, organizacionId });
  }

  async getUsuarioAgendamientos(idUsuario) {
    const getUsuarioAgendamientos = new GetUsuarioAgendamientoUseCase(
      this.usuarioRepository
    );

    return await getUsuarioAgendamientos.execute(idUsuario);
  }

  async deleteUsuario(idUsuario, organizacionId) {
    const deleteUsuario = new DeleteUsuarioUseCase(this.usuarioRepository);

    return await deleteUsuario.execute(idUsuario, organizacionId);
  }

  async updateUsuario(idUsuario, updates, organizacionId) {
    const updateUsuario = new UpdateUsuarioUseCase(this.usuarioRepository);

    return await updateUsuario.execute(idUsuario, updates, organizacionId);
  }

  async createAgendamiento(body) {
    const createAgendamiento = new CreateAgendamientoUsuarioUseCase(
      this.usuarioRepository
    );

    return await createAgendamiento(body);
  }
}
