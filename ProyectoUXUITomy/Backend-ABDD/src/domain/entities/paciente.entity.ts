export class Paciente {
  constructor(
    private readonly id: string,
    private tutor: string,
    private nombre: string,
    private raza: string,
    private edad: Number,
    private especie: string,
    private genero: string,
  ) {}

  public getId(): string {
    return this.id;
  }

  public getTutor(): string {
    return this.tutor;
  }

  public getNombre(): string {
    return this.nombre;
  }

  public getRaza(): string {
    return this.raza;
  }

  public getEdad(): Number {
    return this.edad;
  }

  public getEspecie(): string {
    return this.especie;
  }

  public getGenero(): string {
    return this.genero;
  }

  private setTutor(newTutor: string): void {
    //tutor is an id, however it should be possible to change if the tutor changes,
    //but should not be easily available to do so.
    this.tutor = newTutor;
  }

  private setNombre(newName: string): void {
    this.nombre = newName;
  }

  private setRaza(newRace: string): void {
    this.raza = newRace;
  }

  private setEdad(newAge: Number): void {
    this.edad = newAge;
  }

  private setEspecie(newSpecies: string): void {
    this.especie = newSpecies;
  }

  public UpdateData(
    tutor?: string,
    nombre?: string,
    raza?: string,
    edad?: Number,
    especie?: string,
  ) {
    const newData = [tutor, nombre, raza, edad, especie];
    const setFunctions: ((newValue: string | Number) => void)[] = [
      this.setTutor.bind(this),
      this.setNombre.bind(this),
      this.setRaza.bind(this),
      this.setEdad.bind(this),
      this.setEspecie.bind(this),
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
