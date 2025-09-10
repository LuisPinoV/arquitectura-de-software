import { Medicamento } from './medicamento';

export class Procedimiento {
  public idmedicos: string[];
  public procedimiento: string;
  public costo: Number;
  public medicamentos: Medicamento[];

  public toRawObject() {
    return {
      idmedicos: this.idmedicos,
      procedimiento: this.procedimiento,
      costo: this.costo,
      medicamentos: this.medicamentos.map((medicamento) =>
        medicamento.toRawObject(),
      ),
    };
  }
}
