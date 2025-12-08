export class UpdateUsuarioUseCase {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    async execute(idUsuario, updates, organizacionId) {
        const updated = await this.usuarioRepository.updateUsuario(idUsuario, updates, organizacionId);

        if (!updated) throw new Error("Couldn't update usuario");

        return updated;
    }
}