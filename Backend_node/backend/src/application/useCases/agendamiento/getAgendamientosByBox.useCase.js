export class GetAgendamientosByBoxUseCase {
  constructor(agendamientoRepository) {
    this.agendamientoRepository = agendamientoRepository;
  }

  async execute(idBox) {
    try {
      const agendamientos = await this.agendamientoRepository.getAgendamientosByBox(idBox);
      return agendamientos;
    } catch (error) {
      throw new Error("Couldn't get agendamientos by box");
    }
  }
}