export class CreateUsuarioUseCase
{
    constructor(usuarioRepository)
    {
        this.usuarioRepository = usuarioRepository;
    }

    async execute(body)
    {
        const created = await this.usuarioRepository.createUsuario(body);

        if(!created) throw new Error("Couldn't create user");

        return created;
    }
}