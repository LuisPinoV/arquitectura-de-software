export class CreateAgendamientoUseCase {
  constructor(agendamientoRepository) {
    this.agendamientoRepository = agendamientoRepository;
  }

  async execute(agendamientoData) {
    try {
      const agendamiento = await this.agendamientoRepository.createAgendamiento(agendamientoData);
      return agendamiento;
    } catch (error) {
      throw new Error("Couldn't create agendamiento");
    }
  }
}