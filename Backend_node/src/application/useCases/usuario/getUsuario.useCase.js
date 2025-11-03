export class GetUsuarioUseCase
{
    constructor(usuarioRepository)
    {
        this.usuarioRepository = usuarioRepository;
    }

    async execute(idUsuario)
    {
        const usuario = await this.usuarioRepository.getUsuario(idUsuario);

        if(!usuario) throw new Error("Couldn't get user");

        return usuario;
    }
}