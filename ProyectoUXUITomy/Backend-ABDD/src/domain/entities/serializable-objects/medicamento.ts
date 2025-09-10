export class Medicamento
{
    public nombre:string;
    public cantidad:Number;

    public toRawObject() {
    return {
      nombre: this.nombre,
      cantidad: this.cantidad
    };
  }
}