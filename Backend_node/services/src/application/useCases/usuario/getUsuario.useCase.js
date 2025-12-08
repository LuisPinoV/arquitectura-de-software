export class GetUsuarioUseCase {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    async execute(idUsuario, organizacionId) {
        const usuario = await this.usuarioRepository.getUsuario(idUsuario, organizacionId);

        if (!usuario) throw new Error("Couldn't get usuario");

        return usuario;
    }
}