export class DeleteUsuarioUseCase {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    async execute(idUsuario, organizacionId) {
        const deleted = await this.usuarioRepository.deleteUsuario(idUsuario, organizacionId);

        if (!deleted) throw new Error("Couldn't delete usuario");

        return deleted;
    }
}