export class GetUsuariosUseCase
{
    constructor(usuarioRepository)
    {
        this.usuarioRepository = usuarioRepository;
    }

    async execute()
    {
        const usuarios = await this.usuarioRepository.getUsuarios();

        if(!usuarios) throw new Error("Couldn't get users");

        return usuarios;
    }
}