//Use cases

import { GetUsuariosUseCase } from "../useCases/usuario/getUsuarios.useCase";


export class UsuarioService {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async getUsuarios()
  {
    const getUsuarios = new GetUsuariosUseCase(this.usuarioRepository);

    return await getUsuarios.execute();
  }
}
