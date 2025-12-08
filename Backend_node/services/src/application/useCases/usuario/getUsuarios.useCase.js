export class GetUsuariosUseCase {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    async execute(organizacionId) {
        const usuarios = await this.usuarioRepository.getAllPacientes(organizacionId);

        if (!usuarios) throw new Error("Couldn't get usuarios");

        return usuarios;
    }
}