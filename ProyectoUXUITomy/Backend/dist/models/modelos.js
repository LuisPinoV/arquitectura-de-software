"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = exports.EstadoAgendamiento = exports.ResultadosConsulta = exports.Agendamiento = exports.Funcionario = exports.Box = exports.Persona = exports.TipoFuncionario = exports.EspecialidadBox = void 0;
class EspecialidadBox {
    id;
    especialidad;
    constructor(id, especialidad) {
        this.id = id;
        this.especialidad = especialidad;
    }
}
exports.EspecialidadBox = EspecialidadBox;
class TipoFuncionario {
    id;
    tipo;
    constructor(id, tipo) {
        this.id = id;
        this.tipo = tipo;
    }
}
exports.TipoFuncionario = TipoFuncionario;
class Persona {
    id;
    nombre;
    apellido;
    rut;
    constructor(id, nombre, apellido, rut) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.rut = rut;
    }
}
exports.Persona = Persona;
class Box {
    id;
    idEspecialidadBox;
    pasillo;
    constructor(id, idEspecialidadBox, pasillo) {
        this.id = id;
        this.idEspecialidadBox = idEspecialidadBox;
        this.pasillo = pasillo;
    }
}
exports.Box = Box;
class Funcionario {
    id;
    idTipoFuncionario;
    nombre;
    rut;
    constructor(id, idTipoFuncionario, nombre, rut) {
        this.id = id;
        this.idTipoFuncionario = idTipoFuncionario;
        this.nombre = nombre;
        this.rut = rut;
    }
}
exports.Funcionario = Funcionario;
class Agendamiento {
    id;
    idBox;
    idFuncionario;
    idPaciente;
    fecha;
    horaEntrada;
    horaSalida;
    constructor(id, idBox, idFuncionario, idPaciente, fecha, horaEntrada, horaSalida) {
        this.id = id;
        this.idBox = idBox;
        this.idFuncionario = idFuncionario;
        this.idPaciente = idPaciente;
        this.fecha = fecha;
        this.horaEntrada = horaEntrada;
        this.horaSalida = horaSalida;
    }
}
exports.Agendamiento = Agendamiento;
class ResultadosConsulta {
    idAgendamiento;
    vino;
    atendido;
    horaLlegada;
    vinoDate;
    llamadoDate;
    constructor(idAgendamiento, vino, atendido, horaLlegada, vinoDate, llamadoDate) {
        this.idAgendamiento = idAgendamiento;
        this.vino = vino;
        this.atendido = atendido;
        this.horaLlegada = horaLlegada;
        this.vinoDate = vinoDate;
        this.llamadoDate = llamadoDate;
    }
}
exports.ResultadosConsulta = ResultadosConsulta;
class EstadoAgendamiento {
    idAgendamiento;
    estado;
    fechaEstado;
    constructor(idAgendamiento, estado, fechaEstado) {
        this.idAgendamiento = idAgendamiento;
        this.estado = estado;
        this.fechaEstado = fechaEstado;
    }
}
exports.EstadoAgendamiento = EstadoAgendamiento;
class Usuario {
    nombre;
    contraseña;
    rol;
    adicional;
    constructor(nombre, contraseña, rol, adicional) {
        this.nombre = nombre;
        this.contraseña = contraseña;
        this.rol = rol;
        this.adicional = adicional;
    }
}
exports.Usuario = Usuario;
//# sourceMappingURL=modelos.js.map