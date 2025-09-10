import { Procedimiento } from './procedimiento';

export class RevisionMedica {
  public peso: Number;
  public presion: Number;
  public temperatura: Number;
  public fechahora: Date;
  public idmedico: string;
  public costo: Number;
  public pagado: Boolean;
  public procedimientos: Procedimiento[];

  public toRawObject() {
    return {
      peso: this.peso,
      presion: this.presion,
      temperatura: this.temperatura,
      fechahora: this.fechahora.toISOString(),
      idmedico: this.idmedico,
      costo: this.costo,
      pagado: this.pagado,
      procedimientos: this.procedimientos.map((procedimiento) =>
        procedimiento.toRawObject(),
      ),
    };
  }
}
