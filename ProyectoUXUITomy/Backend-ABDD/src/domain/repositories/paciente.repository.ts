import { Paciente } from "../entities/paciente.entity";

export interface IPacienteRepository 
{
    //Create
    CreatePaciente(paciente: Paciente):Promise<void>;
    //Read
    FindById(id: string): Promise<Paciente | null>;
    //Update
    UpdatePaciente(paciente:Paciente): Promise<void>;
    //Delete
    DeletePaciente(id:string): Promise<string>;

    DeleteAll():Promise<string>;
    FindAll():Promise<Paciente[] | undefined>;
}