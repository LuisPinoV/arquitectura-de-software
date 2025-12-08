export class CreateUsuarioUseCase {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    async execute(body) {
        // body ya incluye organizacionId desde el service
        const usuario = await this.usuarioRepository.createUsuario(body);

        if (!usuario) throw new Error("Couldn't create usuario");

        return usuario;
    }
}