export class DiferenciaOcupanciaMesesUseCase {
  constructor(agendamientoRepository) {
    this.agendamientoRepository = agendamientoRepository;
  }

  async execute(mes1, mes2) {
    try {
      const resultado = await this.agendamientoRepository.diferenciaOcupanciaMeses(mes1, mes2);
      return resultado;
    } catch (error) {
      throw new Error("Couldn't calculate occupancy difference between months");
    }
  }
}