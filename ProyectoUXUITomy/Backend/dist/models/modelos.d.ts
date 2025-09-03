export declare class EspecialidadBox {
    id: number;
    especialidad: string;
    constructor(id: number, especialidad: string);
}
export declare class TipoFuncionario {
    id: number;
    tipo: string;
    constructor(id: number, tipo: string);
}
export declare class Persona {
    id: number;
    nombre: string;
    apellido: string;
    rut: string;
    constructor(id: number, nombre: string, apellido: string, rut: string);
}
export declare class Box {
    id: number;
    idEspecialidadBox: number;
    pasillo: string;
    constructor(id: number, idEspecialidadBox: number, pasillo: string);
}
export declare class Funcionario {
    id: number;
    idTipoFuncionario: number;
    nombre: string;
    rut: string;
    constructor(id: number, idTipoFuncionario: number, nombre: string, rut: string);
}
export declare class Agendamiento {
    id: number;
    idBox: number;
    idFuncionario: number;
    idPaciente: number;
    fecha: string;
    horaEntrada: string;
    horaSalida: string;
    constructor(id: number, idBox: number, idFuncionario: number, idPaciente: number, fecha: string, horaEntrada: string, horaSalida: string);
}
export declare class ResultadosConsulta {
    idAgendamiento: number;
    vino: boolean;
    atendido: boolean;
    horaLlegada: string;
    vinoDate: string;
    llamadoDate: string;
    constructor(idAgendamiento: number, vino: boolean, atendido: boolean, horaLlegada: string, vinoDate: string, llamadoDate: string);
}
export declare class EstadoAgendamiento {
    idAgendamiento: number;
    estado: string;
    fechaEstado: string;
    constructor(idAgendamiento: number, estado: string, fechaEstado: string);
}
export declare class Usuario {
    nombre: string;
    contraseña: string;
    rol: string;
    adicional: any;
    constructor(nombre: string, contraseña: string, rol: string, adicional?: any);
}
