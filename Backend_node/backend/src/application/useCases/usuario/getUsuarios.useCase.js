export class GetUsuariosUseCase
{
    constructor(usuarioRepository)
    {
        this.usuarioRepository = usuarioRepository;
    }

    async execute(body)
    {
        const usuarios = await this.usuarioRepository.createPaciente(body);

        if(!usuarios) throw new Error("Couldn't create user");

        return usuarios;
    }
}