import { CarnetVacuna } from './serializable-objects/carnet-vacuna';
import { RevisionMedica } from './serializable-objects/revision-medica';

export class FichaMedica {
  constructor(
    private readonly id: string,
    private idMascota: string,
    private revisionesMedicas: RevisionMedica[],
    private carnetVacuna: CarnetVacuna[],
  ) {}

  public getId(): string {
    return this.id;
  }

  public getIdMascota() {
    return this.idMascota;
  }

  public getRevisionesMedicas() {
    return this.revisionesMedicas;
  }

  public getVacunas() {
    return this.carnetVacuna;
  }

  public getJSONFichaMedica() {
    const serialized = new SerializableFichaMedica(
      this.getId(),
      this.getIdMascota(),
      this.getRevisionesMedicas(),
      this.getVacunas(),
    );

    return JSON.stringify(serialized);
  }

  public getJSONReadFichaMedica() {
    const serialized = new SerializableReadFichaMedica(
      this.getIdMascota(),
      this.getRevisionesMedicas(),
      this.getVacunas(),
    );

    return JSON.stringify(serialized);
  }

  public getSerializableReadFichaMedica()
  {
    const serialized = new SerializableReadFichaMedica(
      this.getIdMascota(),
      this.getRevisionesMedicas(),
      this.getVacunas(),
    );

    return serialized;
  }

  public getSerializableFichaMedica()
  {
    const serialized = new SerializableFichaMedica(
      this.getId(),
      this.getIdMascota(),
      this.getRevisionesMedicas(),
      this.getVacunas(),
    );

    return serialized;
  }

  public toRawObject() {
    return {
      id: this.id,
      idMascota: this.idMascota,
      revisionesMedicas: this.revisionesMedicas.map(revisiones => revisiones.toRawObject()),
      carnetVacuna: this.carnetVacuna.map(carnet => carnet.toRawObject())
    };
  }

  public UpdateData(
    idMascota?: string,
    revisionesMedicas?: RevisionMedica[],
    carnetVacuna?: CarnetVacuna[],
  ) {
    const newData = [idMascota, revisionesMedicas, carnetVacuna];
    const setFunctions: ((newValue: string | RevisionMedica[] | CarnetVacuna[]) => void)[] = [
      this.setIdMascota.bind(this),
      this.setRevisionesMedicas.bind(this),
      this.setCarnetVacuna.bind(this),
    ];

    for (let i = 0; i < setFunctions.length; i++) {
      const dataToUpdate = newData[i];
      const curSetFunction = setFunctions[i];

      if (!dataToUpdate) continue;

      curSetFunction(dataToUpdate);
    }
  }

  private setIdMascota(mewIdMascota:string)
  {
    this.idMascota = mewIdMascota;
  }

  private setRevisionesMedicas(newRevisionesMedicas: RevisionMedica[])
  {
    this.revisionesMedicas = newRevisionesMedicas;
  }

  private setCarnetVacuna(newCarnetVacuna: CarnetVacuna[])
  {
    this.carnetVacuna = newCarnetVacuna;
  }
}

export class SerializableReadFichaMedica {
  constructor(
    public idMascota: string,
    public revisionesMedica: RevisionMedica[],
    public vacunas: CarnetVacuna[],
  ) {}
}

class SerializableFichaMedica {
  constructor(
    public id: string,
    public idMascota: string,
    public revisionesMedica: RevisionMedica[],
    public vacunas: CarnetVacuna[],
  ) {}
}
