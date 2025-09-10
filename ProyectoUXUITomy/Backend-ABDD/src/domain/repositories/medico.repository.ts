import { Medico } from '../entities/medico.entity';

export interface IMedicoRepository {
  //Create
  CreateMedico(medico: Medico): Promise<void>;
  //Read
  FindById(id: string): Promise<Medico | null>;
  //Update
  UpdateMedico(medico: Medico): Promise<void>;
  //Delete
  DeleteMedico(id: string): Promise<string>;

  DeleteAll(): Promise<string>;
  FindAll(): Promise<Medico[] | undefined>;
}
