export class VacunaAdministrada {
  public nombrevacuna: string;
  public fecha: Date;

  public toRawObject() {
    return {
      nombrevacuna: this.nombrevacuna,
      fecha: this.fecha.toISOString(),
    };
  }
}
