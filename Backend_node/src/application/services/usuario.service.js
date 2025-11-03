//Use cases

import { CreateAgendamientoUsuarioUseCase } from "../useCases/usuario/createAgendamiento.useCase";
import { CreateUsuarioUseCase } from "../useCases/usuario/createUsuario.useCase";
import { DeleteUsuarioUseCase } from "../useCases/usuario/deleteUsuario.useCase";
import { GetUsuarioUseCase } from "../useCases/usuario/getUsuario.useCase";
import { GetUsuarioAgendamientoUseCase } from "../useCases/usuario/getUsuarioAgendamiento.useCase";
import { GetUsuariosUseCase } from "../useCases/usuario/getUsuarios.useCase";
import { UpdateUsuarioUseCase } from "../useCases/usuario/updateUsuario.useCase";

export class UsuarioService {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async getUsuarios() {
    const getUsuarios = new GetUsuariosUseCase(this.usuarioRepository);

    return await getUsuarios.execute();
  }

  async getUsuario(idUsuario) {
    const getUsuario = new GetUsuarioUseCase(this.usuarioRepository);

    return await getUsuario.execute(idUsuario);
  }

  async createUsuario(body) {
    const createUsuario = new CreateUsuarioUseCase(this.usuarioRepository);

    return await createUsuario.execute(body);
  }

  async getUsuarioAgendamientos(idUsuario) {
    const getUsuarioAgendamientos = new GetUsuarioAgendamientoUseCase(
      this.usuarioRepository
    );

    return await getUsuarioAgendamientos.execute(idUsuario);
  }

  async deleteUsuario(idUsuario) {
    const deleteUsuario = new DeleteUsuarioUseCase(this.usuarioRepository);

    return await deleteUsuario.execute(idUsuario);
  }

  async updateUsuario(idUsuario, updates) {
    const updateUsuario = new UpdateUsuarioUseCase(this.usuarioRepository);

    return await updateUsuario.execute(idUsuario, updates);
  }

  async createAgendamiento(body) {
    const createAgendamiento = new CreateAgendamientoUsuarioUseCase(
      this.usuarioRepository
    );

    return await createAgendamiento(body);
  }
}
