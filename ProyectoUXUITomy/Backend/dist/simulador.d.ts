import * as modelos from './models/modelos';
export declare function simuladorPersona(): modelos.Persona;
export declare function simuladorBox(): modelos.Box;
export declare function simuladorFuncionario(): modelos.Funcionario;
export declare function simuladorAgendamiento(): Promise<modelos.Agendamiento>;
export declare function simuladorResultadosConsulta(agendamiento: any): Promise<modelos.ResultadosConsulta>;
