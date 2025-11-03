export class GetUsuarioAgendamientoUseCase
{
    constructor(usuarioRepository)
    {
        this.usuarioRepository = usuarioRepository;
    }

    async execute(idUsuario)
    {
        const agendamientos = await this.usuarioRepository.getAgendamientosByUsuario(idUsuario);

        if(!agendamientos) throw new Error("Couldn't get user");

        return agendamientos;
    }
}