"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simuladorPersona = simuladorPersona;
exports.simuladorBox = simuladorBox;
exports.simuladorFuncionario = simuladorFuncionario;
exports.simuladorAgendamiento = simuladorAgendamiento;
exports.simuladorResultadosConsulta = simuladorResultadosConsulta;
const { faker } = require('@faker-js/faker');
const modelos = require("./models/modelos");
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: 'myr',
    host: 'localhost',
    database: 'hospital',
    password: '1234',
    port: 5432
});
const nombresmas = ['Tomas', 'Joaquin', 'Christian', 'Martin', 'Vicente', 'Lucas', 'Benjamin', 'Carlos', 'Sebastian', 'Luis', 'Larry', 'Darienn'];
const nombresfem = ['Cristina', 'Martina', 'Benjamina', 'Carla', 'Valentina', 'Camila', 'Constanza'];
const apellidos = ['Ramirez', 'Rodriguez', 'Delgado', 'Arancibia', 'Solano', 'Sanchez', 'Lopez', 'Pino', 'Pinto', 'Martinez'];
const pasillos = ['odontologia', 'broncoPulmonar'];
function Booleano(proba = 0.5) {
    if (proba >= 0 && proba <= 1) {
        return Math.random() <= proba;
    }
    else {
        return Math.random() >= 0.5;
    }
}
function Randomizador(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
}
function RandomFecha(desde, hasta) {
    const desdeLista = desde.split('-');
    const hastaLista = hasta.split('-');
    const año = RandomizadorNumerico(parseInt(hastaLista[0]) - parseInt(desdeLista[0])) + parseInt(desdeLista[0]);
    let mes = 0;
    let dia = 0;
    if (año == parseInt(desdeLista[0])) {
        const diff = 12 - parseInt(desdeLista[1]);
        mes = RandomizadorNumerico(diff) + parseInt(desdeLista[1]);
        const diffDia = 30 - parseInt(desdeLista[2]);
        dia = RandomizadorNumerico(diffDia) + parseInt(desdeLista[2]);
    }
    else {
        if (año == parseInt(hastaLista[0])) {
            const diff = 12 - parseInt(hastaLista[1]);
            mes = RandomizadorNumerico(diff) + 1;
            const diffDia = 30 - parseInt(hastaLista[1]);
            dia = RandomizadorNumerico(diffDia) + parseInt(hastaLista[2]);
        }
        else {
            mes = RandomizadorNumerico(12) + 1;
            dia = RandomizadorNumerico(30) + 1;
        }
    }
    const fecha = String(año) + '-' + String(mes) + '-' + String(dia);
    return fecha;
}
function RandomHora(desde, hasta) {
    const desdeLista = desde.split(':');
    const hastaLista = hasta.split(':');
    const hora = RandomizadorNumerico(parseInt(hastaLista[0]) - parseInt(desdeLista[0])) + parseInt(desdeLista[0]);
    const minuto = RandomizadorNumerico(60);
    const segundo = RandomizadorNumerico(60);
    const tiempo = String(hora) + ':' + String(minuto) + ':' + String(segundo);
    return tiempo;
}
function RandomizadorNumerico(n) {
    return Math.floor(Math.random() * n);
}
function RandomRut(min = 10000000, max = 28000000) {
    max -= min;
    let rut = RandomizadorNumerico(max) + min;
    return rut.toString();
}
function simuladorPersona() {
    const bool = Booleano();
    let nombre = '';
    if (bool) {
        nombre = Randomizador(nombresfem);
    }
    else {
        nombre = Randomizador(nombresmas);
    }
    const persona = new modelos.Persona(1, nombre, Randomizador(apellidos), RandomRut());
    return persona;
}
function simuladorBox() {
    const pasillo = Randomizador(pasillos);
    let idEspecialidadBox = RandomizadorNumerico(3) + 1;
    if (idEspecialidadBox == 3) {
        if (pasillo == 'odontologia') {
            idEspecialidadBox = 4;
        }
        else {
            idEspecialidadBox = 5;
        }
    }
    const box = new modelos.Box(1, idEspecialidadBox, pasillo);
    return box;
}
function simuladorFuncionario() {
    const bool = Booleano();
    let nombre = '';
    if (bool) {
        nombre = Randomizador(nombresfem);
    }
    else {
        nombre = Randomizador(nombresmas);
    }
    const idTipoFuncionario = RandomizadorNumerico(4) + 1;
    const rut = RandomRut();
    const funcionario = new modelos.Funcionario(1, idTipoFuncionario, nombre, rut);
    return funcionario;
}
async function simuladorAgendamiento() {
    let boxes = await pool.query('SELECT idBox FROM box');
    const idBox = Randomizador(boxes.rows).idbox;
    let funcionarios = await pool.query('SELECT idfuncionario FROM funcionario');
    const idFuncionario = Randomizador(funcionarios.rows).idfuncionario;
    let pacientes = await pool.query('SELECT idpaciente FROM paciente');
    const idPaciente = Randomizador(pacientes.rows).idpaciente;
    const fecha = RandomFecha('2020-01-02', '2025-06-30');
    const horaEntrada = RandomHora('08:00:00', '18:00:00');
    let temp = horaEntrada.split(':');
    const horaNueva = parseInt(temp[0]) + 1;
    const horaSalida = RandomHora(horaEntrada, String(horaNueva) + ':30:00');
    return new modelos.Agendamiento(1, idBox, idFuncionario, idPaciente, fecha, horaEntrada, horaSalida);
}
const diccionario = {};
diccionario["Jan"] = 1;
diccionario["Feb"] = 2;
diccionario["Mar"] = 3;
diccionario["Feb"] = 4;
diccionario["Feb"] = 5;
diccionario["Feb"] = 6;
diccionario["Feb"] = 7;
diccionario["Feb"] = 8;
diccionario["Feb"] = 9;
diccionario["Oct"] = 10;
diccionario["Feb"] = 11;
diccionario["Feb"] = 12;
async function simuladorResultadosConsulta(agendamiento) {
    const vino = Booleano(0.95);
    let atendido = false;
    let horaLlegada = '00:00:00';
    let vinoDate = '2000-01-01 00:00:00';
    let llamadoDate = '2000-01-01 00:00:00';
    if (vino) {
        atendido = Booleano(0.85);
        if (atendido) {
            const tiempo = agendamiento.horaEntrada.split(':');
            let hora = parseInt(tiempo[0]);
            let minuto = parseInt(tiempo[1]);
            if (parseInt(tiempo[1]) < 10) {
                hora -= 1;
                minuto += 50;
            }
            else {
                minuto -= 10;
            }
            horaLlegada = String(hora) + ':' + String(minuto) + ':00';
            const fecha = agendamiento.fecha;
            vinoDate = fecha + ' ' + String(horaLlegada);
            llamadoDate = fecha + ' ' + String(agendamiento.horaEntrada);
        }
    }
    return new modelos.ResultadosConsulta(agendamiento.id, vino, atendido, horaLlegada, vinoDate, llamadoDate);
}
//# sourceMappingURL=simulador.js.map