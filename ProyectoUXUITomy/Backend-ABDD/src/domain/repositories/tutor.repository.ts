import { Tutor } from "../entities/tutor.entity";

export interface ITutorRepository 
{
    //Create
    CreateTutor(tutor: Tutor):Promise<void>;
    //Read
    FindById(id: string): Promise<Tutor | null>;
    //Update
    UpdateTutor(tutor:Tutor): Promise<void>;
    //Delete
    DeleteTutor(id:string): Promise<string>;

    DeleteAll():Promise<string>;
    FindAll():Promise<Tutor[] | undefined>;

    MascotasTotales():Promise<Number[] | null>;
}