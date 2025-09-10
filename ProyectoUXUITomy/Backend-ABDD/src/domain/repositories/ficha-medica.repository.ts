import { FichaMedica } from "../entities/ficha-medica.entity";

export interface IFichaMedicaRepository {
  //Create
  CreateFicha(fichaMedica: FichaMedica): Promise<void>;
  //Read
  FindById(id: string): Promise<FichaMedica | null>;
  //Update
  UpdateFicha(fichaMedica: FichaMedica): Promise<void>;
  //Delete
  DeleteFicha(id: string): Promise<string>;

  DeleteAll(): Promise<string>;
  FindAll(): Promise<FichaMedica[] | undefined>;

  FindByPetId(idMascota:string): Promise<FichaMedica | null>;

  FindAllProceduresMoney(): Promise<{procedimiento:string, costo:Number}[] | null>;

  FindAllVaccines(): Promise<string[] | null>;

  FindMedsWithQuantity(): Promise<{medicamento:string, cantidad:Number}[] | null>;

  GetMedicosIDs(): Promise<string[] | null> 

  GetRevisionesPagos(): Promise<boolean[] | null>
}
