export class GetUsuarioUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute(body) {
    const usuario = await this.usuarioRepository.createAgendamiento(body);

    if (!usuario) throw new Error("Couldn't get user");

    return usuario;
  }
}
