export class EspecialidadBox {
    id: number;
    especialidad: string;

    constructor(id: number, especialidad: string) {
        this.id = id
        this.especialidad = especialidad
    }
}

export class TipoFuncionario {
    id: number;
    tipo: string;

    constructor(id: number, tipo:string){
        this.id = id
        this.tipo = tipo
    }
}

export class Persona {
    id: number;
    nombre: string;
    apellido: string;
    rut: string;

    constructor(id: number, nombre: string, apellido: string, rut:string) {
        this.id = id
        this.nombre = nombre
        this.apellido = apellido
        this.rut = rut
    }
}

export class Box {
    id: number;
    idEspecialidadBox: number;
    pasillo: string;

    constructor(id: number, idEspecialidadBox: number, pasillo: string) {
        this.id = id
        this.idEspecialidadBox = idEspecialidadBox
        this.pasillo = pasillo
    }
}

export class Funcionario {
    id: number;
    idTipoFuncionario: number;
    nombre: string;
    rut: string;

    constructor(id: number, idTipoFuncionario: number, nombre:string, rut: string) {
        this.id = id
        this.idTipoFuncionario = idTipoFuncionario
        this.nombre = nombre
        this.rut = rut
    }
}

export class Agendamiento {
    id: number;
    idBox: number;
    idFuncionario: number;
    idPaciente: number;
    fecha: string;
    horaEntrada: string;
    horaSalida: string;

    constructor(id:number, idBox:number, idFuncionario:number, idPaciente:number,fecha:string, horaEntrada:string, horaSalida:string){
        this.id = id
        this.idBox = idBox
        this.idFuncionario = idFuncionario
        this.idPaciente = idPaciente
        this.fecha = fecha
        this.horaEntrada = horaEntrada
        this.horaSalida = horaSalida
    }
}

export class ResultadosConsulta {
    idAgendamiento: number;
    vino: boolean;
    atendido: boolean;
    horaLlegada: string;
    vinoDate: string;
    llamadoDate: string;

    constructor(idAgendamiento: number,vino:boolean, atendido: boolean, horaLlegada: string, vinoDate:string, llamadoDate:string){
        this.idAgendamiento = idAgendamiento
        this.vino = vino
        this.atendido = atendido
        this.horaLlegada = horaLlegada
        this.vinoDate = vinoDate
        this.llamadoDate = llamadoDate
    }
}

export class EstadoAgendamiento {
    idAgendamiento: number;
    estado: string;
    fechaEstado: string;

    constructor(idAgendamiento: number, estado: string, fechaEstado: string){
        this.idAgendamiento = idAgendamiento
        this.estado = estado
        this.fechaEstado = fechaEstado
    }
}

export class Usuario {
    nombre: string;
    contraseña: string;
    rol: string;
    adicional: any;

    constructor(nombre: string, contraseña: string, rol: string, adicional?: any) {
        this.nombre = nombre
        this.contraseña = contraseña
        this.rol = rol
        this.adicional = adicional
    }
}