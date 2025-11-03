export class DeleteUsuarioUseCase
{
    constructor(usuarioRepository)
    {
        this.usuarioRepository = usuarioRepository;
    }

    async execute(usuarioId)
    {
        const deleted = await this.usuarioRepository.deleteUsuario(usuarioId);

        if(!deleted) throw new Error("Couldn't delete user");

        return deleted;
    }
}