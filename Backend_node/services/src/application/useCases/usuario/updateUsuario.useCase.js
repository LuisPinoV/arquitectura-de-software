export class UpdateUsuarioUseCase
{
    constructor(usuarioRepository)
    {
        this.usuarioRepository = usuarioRepository;
    }

    async execute(usuarioId, updates)
    {
        const updated = await this.usuarioRepository.updateUsuario(usuarioId, updates);

        if(!updated) throw new Error("Couldn't update user");

        return updated;
    }
}