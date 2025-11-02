export class GetAgendamientoBoxUseCase
{
    constructor(boxRepository)
    {
        this.boxRepository = boxRepository;
    }

    async execute(idBox)
    {
        const agendamientos = await this.boxRepository.getAgendamientosByBox(idBox);

        if(!agendamientos) throw new Error("Couldn't get agendamientos box");
        
        return agendamientos;
    }
}