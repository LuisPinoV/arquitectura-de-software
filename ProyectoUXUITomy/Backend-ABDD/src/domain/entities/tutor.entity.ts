export class Tutor {
  constructor(
    private readonly id: string,
    private nombre: string,
    private idMascotas: string[],
  ) {}

  public getId(): string {
    return this.id;
  }

  public getNombre() {
    return this.nombre;
  }

  public setNombre(newName: string) {
    this.HasSpecialCharacters(newName) ? console.log("Found special characters") : this.nombre = newName;    
  }

  public getMascota(id: string) {
    for (let i = 0; i < this.idMascotas.length; i++) {
      if (this.idMascotas[i] === id) return this.idMascotas[i];
    }
  }

  public setMascotas(mascotas: string[])
  {
    this.idMascotas = mascotas;
  }

  public getMascotas() {
    return this.idMascotas;
  }

  public deleteMascota(id:string)
  {
    const index = this.idMascotas.indexOf(id, 0);
    if(index > -1)
    {
      this.idMascotas.splice(index, 1)
    }
  }

  public pushMascota(idMascota:string)
  {
    this.idMascotas.push(idMascota);
  }

  public UpdateData(nombre?: string, mascotas?:string[]) {
    const newData = [nombre, mascotas];
    const setFunctions: ((newValue: string | string[]) => void)[] = [
      this.setNombre.bind(this),
      this.setMascotas.bind(this)
    ];

    for (let i = 0; i < setFunctions.length; i++) {
      const dataToUpdate = newData[i];
      const curSetFunction = setFunctions[i];

      if (!dataToUpdate) continue;

      curSetFunction(dataToUpdate);
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
