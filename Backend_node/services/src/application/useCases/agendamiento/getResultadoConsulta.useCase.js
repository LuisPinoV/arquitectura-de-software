export class GetResultadoConsultaUseCase {
  constructor(agendamientoRepository) {
    this.agendamientoRepository = agendamientoRepository;
  }

  async execute(idConsulta) {
    try {
      const resultado = await this.agendamientoRepository.getResultadoConsulta(idConsulta);
      return resultado;
    } catch (error) {
      throw new Error("Couldn't get consultation result");
    }
  }
}