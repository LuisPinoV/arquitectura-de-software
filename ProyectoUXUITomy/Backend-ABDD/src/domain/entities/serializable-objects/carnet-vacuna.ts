import { VacunaAdministrada } from './vacuna';

export class CarnetVacuna {
  constructor(
    public enfermedad: string,
    public vacunasadministradas: VacunaAdministrada[],
  ) {}

  public toRawObject() {
    return {
      enfermedad: this.enfermedad,
      vacunasadministradas: this.vacunasadministradas.map((vacunas) =>
        vacunas.toRawObject(),
      ),
    };
  }
}
