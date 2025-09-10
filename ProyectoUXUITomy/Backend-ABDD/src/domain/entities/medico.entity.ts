export class Medico {
  constructor(
    private readonly id: string,
    private nombre: string,
    private estado: string,
    private especialidad: string,
  ) {}

  public getId(): string {
    return this.id;
  }

  public getNombre(): string {
    return this.nombre;
  }

  private setNombre(newNombre:string)
  {
    this.nombre = newNombre;
  }

  public getEstado(): string {
    return this.estado;
  }

  private setEstado(newEstado: string) {
    this.estado = newEstado;
  }

  public getEspecialidad() {
    return this.especialidad;
  }

  private setEspecialidad(newEspecialidad:string)
  {
    this.especialidad = newEspecialidad;
  }

  public UpdateData(
    nombre?: string,
    estado?: string,
    especialidad?: string,
  ) {
    const newData = [nombre, estado, especialidad];
    const setFunctions: ((newValue: string | Number) => void)[] = [
      this.setNombre.bind(this),
      this.setEstado.bind(this),
      this.setEspecialidad.bind(this),
    ];

    for (let i = 0; i < setFunctions.length; i++) {
      const dataToUpdate = newData[i];
      const curSetFunction = setFunctions[i];

      if (!dataToUpdate) continue;

      this.HasSpecialCharacters(dataToUpdate.toString())
        ? console.log('Special Characters found on update')
        : curSetFunction(dataToUpdate);
    }
  }

  private HasSpecialCharacters(str: string): boolean {
    if (isNaN(Number(str))) return false;

    const regex = /[^A-Za-z0-9]/;
    if (regex.test(str)) {
      return true;
    }

    return false;
  }
}
