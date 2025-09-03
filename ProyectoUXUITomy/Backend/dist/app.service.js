"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const simulador_1 = require("./simulador");
const modelos = require("./models/modelos");
const console_1 = require("console");
const pool = new pg_1.Pool({
    user: 'myr',
    host: 'localhost',
    database: 'hospital',
    password: '1234',
    port: 5432,
});
const meses30 = ['04', '06', '09', '11'];
const meses31 = ['01', '03', '05', '07', '08', '10', '12'];
function fechador(fecha1, fecha2) {
    if (fecha1 == fecha2) {
        return fecha2;
    }
    const temp = fecha1.split('-');
    if (temp[1] == '02' && temp[2] == '28') {
        temp[1] = '03';
        temp[2] = '01';
    }
    else {
        if (meses30.includes(temp[1]) && temp[2] == '30') {
            temp[2] = '01';
            if (parseInt(temp[1]) < 9) {
                temp[1] = '0' + String(parseInt(temp[1]) + 1);
            }
            else {
                temp[1] = String(parseInt(temp[1]) + 1);
            }
        }
        else {
            if (meses31.includes(temp[1]) && temp[2] == '31') {
                temp[2] = '01';
                if (temp[1] == '12') {
                    temp[0] = String(parseInt(temp[0]) + 1);
                    temp[1] = '01';
                }
                else {
                    if (parseInt(temp[1]) < 9) {
                        temp[1] = '0' + String(parseInt(temp[1]) + 1);
                    }
                    else {
                        temp[1] = String(parseInt(temp[1]) + 1);
                    }
                }
            }
            else {
                if (parseInt(temp[2]) < 9) {
                    temp[2] = '0' + String(parseInt(temp[2]) + 1);
                }
                else {
                    temp[2] = String(parseInt(temp[2]) + 1);
                }
            }
        }
    }
    const fechaTemp = temp[0] + '-' + temp[1] + '-' + temp[2];
    return fecha1 + ';' + fechador(fechaTemp, fecha2);
}
let AppService = class AppService {
    async getEspecialidadBox() {
        const resultados = await pool.query('SELECT * FROM especialidadbox');
        return resultados.rows;
    }
    async getTipoFuncionario() {
        const resultados = await pool.query('SELECT * FROM tipofuncionario');
        return resultados.rows;
    }
    async getPaciente() {
        const resultados = await pool.query('SELECT * FROM paciente');
        return resultados.rows;
    }
    async getBox() {
        const resultados = await pool.query('SELECT * FROM box');
        return resultados.rows;
    }
    async getFuncionario() {
        const resultados = await pool.query('SELECT * FROM funcionario');
        return resultados.rows;
    }
    async getAgendamiento() {
        const resultados = await pool.query('SELECT * FROM agendamiento');
        return resultados.rows;
    }
    async getResultadosConsulta() {
        const resultados = await pool.query('SELECT * FROM resultadosConsulta');
        return resultados.rows;
    }
    async getEstadoAgendamiento() {
        try {
            const res = await pool.query("SELECT * FROM estadoagendamiento");
            return res.rows;
        }
        catch (error) {
            throw error;
        }
    }
    async postPaciente() {
        const persona = (0, simulador_1.simuladorPersona)();
        try {
            const query = 'INSERT INTO paciente(nombre, apellido, rut) VALUES ($1, $2, $3)';
            const values = [persona.nombre, persona.apellido, persona.rut];
            const res = await pool.query(query, values);
            console.log(res.rows);
            return persona;
        }
        catch (error) {
            throw error;
        }
    }
    async postBox() {
        const box = (0, simulador_1.simuladorBox)();
        try {
            const query = 'INSERT INTO box(idEspecialidadBox, pasillo) VALUES ($1, $2)';
            const values = [box.idEspecialidadBox, box.pasillo];
            const res = await pool.query(query, values);
            console.log(res.rows);
            return box;
        }
        catch (error) {
            throw error;
        }
    }
    async postFuncionario() {
        const funcionario = (0, simulador_1.simuladorFuncionario)();
        try {
            const query = 'INSERT INTO funcionario(idTipoFuncionario, nombre, rut) VALUES ($1, $2, $3) RETURNING idfuncionario';
            const values = [
                funcionario.idTipoFuncionario,
                funcionario.nombre,
                funcionario.rut,
            ];
            const res = await pool.query(query, values);
            console.log(res.rows);
            return funcionario;
        }
        catch (error) {
            throw error;
        }
    }
    async postAgendamiento() {
        let jsonRes = {};
        const agendamiento = await (0, simulador_1.simuladorAgendamiento)();
        const query = 'INSERT INTO agendamiento(idbox, idfuncionario, idpaciente, fecha, horaEntrada, horaSalida) VALUES ($1, $2, $3, $4, $5, $6) RETURNING idagendamiento';
        const values = [
            agendamiento.idBox,
            agendamiento.idFuncionario,
            agendamiento.idPaciente,
            agendamiento.fecha,
            agendamiento.horaEntrada,
            agendamiento.horaSalida,
        ];
        const res = await pool.query(query, values);
        agendamiento.id = res.rows[0].idagendamiento;
        console.log(agendamiento);
        jsonRes['agendamiento'] = agendamiento;
        const query2 = "INSERT INTO estadoagendamiento(idagendamiento,estado,fechaestado) VALUES ($1, $2, $3)";
        let hoy = new Date();
        let hoyString = hoy.toISOString().split('T')[0];
        const values2 = [agendamiento.id, 'En revisión', hoyString];
        try {
            const res = await pool.query(query2, values2);
            const temp = new modelos.EstadoAgendamiento(agendamiento.id, 'En revisión', hoyString);
            console.log(temp);
            jsonRes['estadoAgendamiento'] = temp;
        }
        catch (error) {
            throw error;
        }
        return jsonRes;
    }
    async getAgendamientoEspecialidad(especialidad) {
        const jsonAgendamientos = {};
        const query2 = "SELECT idespecialidadbox FROM especialidadbox WHERE especialidad = $1";
        const values2 = [especialidad];
        let idespecialidadbox = -1;
        try {
            const especialidades = await pool.query(query2, values2);
            idespecialidadbox = especialidades.rows[0].idespecialidadbox;
        }
        catch (error) {
            throw error;
        }
        const query = 'SELECT idagendamiento,agendamiento.idbox,idfuncionario,idpaciente,fecha,horaentrada,horasalida FROM agendamiento INNER JOIN box ON agendamiento.idbox = box.idbox WHERE idespecialidadbox = $1';
        const values = [idespecialidadbox];
        let res = await pool.query(query, values);
        res.rows.forEach((element) => {
            let temp = new modelos.Agendamiento(element.idagendamiento, element.idbox, element.idfuncionario, element.idpaciente, element.fecha, element.horaentrada, element.horasalida);
            jsonAgendamientos[element.idagendamiento] = temp;
        });
        return jsonAgendamientos;
    }
    async getCountAgendamientosPorEspecialidad() {
        const listaAgendamientos = [];
        const query = `SELECT 
          especialidadbox.especialidad as especialidad,
          COUNT(*) AS total_agendamientos
        FROM agendamiento
        INNER JOIN box ON agendamiento.idbox = box.idbox
        INNER JOIN especialidadbox ON box.idbox = especialidadbox.idespecialidadbox
        WHERE fecha >= NOW() - INTERVAL '5 years'
        GROUP BY especialidadbox.especialidad
        ORDER BY total_agendamientos DESC;`;
        let res = await pool.query(query);
        res.rows.forEach((element) => {
            let temp = {
                especialidad: element.especialidad,
                count: element.total_agendamientos,
            };
            listaAgendamientos.push(temp);
        });
        return listaAgendamientos;
    }
    async getCountAgendamientosPorEspecialidadRangoFechas(fecha_inicio, fecha_final) {
        const listaAgendamientos = [];
        const query = `SELECT 
          especialidadbox.especialidad as especialidad,
          COUNT(*) AS total_agendamientos
        FROM agendamiento
        INNER JOIN box ON agendamiento.idbox = box.idbox
        INNER JOIN especialidadbox ON box.idbox = especialidadbox.idespecialidadbox
        WHERE fecha >= $1 AND fecha <= $2
        GROUP BY especialidadbox.especialidad
        ORDER BY total_agendamientos DESC;`;
        const values = [fecha_inicio, fecha_final];
        let res = await pool.query(query, values);
        res.rows.forEach((element) => {
            let temp = {
                especialidad: element.especialidad,
                count: element.total_agendamientos,
            };
            listaAgendamientos.push(temp);
        });
        return listaAgendamientos;
    }
    async getAgendamientoFecha(fecha1, fecha2) {
        let listaAgendamientos = [];
        const query = 'SELECT * FROM agendamiento WHERE fecha BETWEEN $1 AND $2';
        const values = [fecha1, fecha2];
        const res = await pool.query(query, values);
        res.rows.forEach((element) => {
            let temp = new modelos.Agendamiento(element.idagendamiento, element.idbox, element.idfuncionario, element.idpaciente, element.fecha, element.horaentrada, element.horasalida);
            listaAgendamientos.push(temp);
        });
        return listaAgendamientos;
    }
    async getAgendamientoEspecialidadFecha(especialidad, fecha1, fecha2) {
        const especialidades = await pool.query('SELECT * FROM especialidadbox');
        let idEspecialidadBox = 0;
        especialidades.rows.forEach((element) => {
            if (especialidad == element.especialidad) {
                idEspecialidadBox = element.idespecialidadbox;
            }
        });
        let listaAgendamientos = [];
        if (idEspecialidadBox != 0) {
            const query = 'SELECT idagendamiento,agendamiento.idbox,idfuncionario,idpaciente,fecha,horaentrada,horasalida FROM agendamiento INNER JOIN box ON agendamiento.idbox = box.idbox WHERE idespecialidadbox = $1 AND fecha BETWEEN $2 AND $3';
            const values = [idEspecialidadBox, fecha1, fecha2];
            const res = await pool.query(query, values);
            res.rows.forEach((element) => {
                let temp = new modelos.Agendamiento(element.idagendamiento, element.idbox, element.idfuncionario, element.idpaciente, element.fecha, element.horaentrada, element.horasalida);
                listaAgendamientos.push(temp);
            });
            return listaAgendamientos;
        }
        else {
            throw (0, console_1.error)('Especialidad no existente');
        }
    }
    async postAgendamientoPersonalizado(idBox, idFuncionario, idPaciente, fecha, horaEntrada, horaSalida) {
        const jsonRes = {};
        const query = 'INSERT INTO agendamiento(idbox, idfuncionario, idpaciente, fecha, horaentrada, horasalida) VALUES ($1, $2, $3, $4, $5, $6) RETURNING idagendamiento';
        const values = [idBox, idFuncionario, idPaciente, fecha, horaEntrada, horaSalida,];
        let idAgendamiento = await pool.query(query, values);
        idAgendamiento = idAgendamiento.rows[0].idagendamiento;
        const agendamiento = new modelos.Agendamiento(idAgendamiento, idBox, idFuncionario, idPaciente, fecha, horaEntrada, horaSalida);
        jsonRes['agendamiento'] = agendamiento;
        let hoy = new Date();
        let hoyString = hoy.toISOString().split('T')[0];
        const query2 = 'INSERT INTO estadoagendamiento(idagendamiento, estado, fechaestado) VALUES ($1, $2, $3)';
        const values2 = [idAgendamiento, 'En revisión', hoyString];
        await pool.query(query2, values2);
        const estado = new modelos.EstadoAgendamiento(idAgendamiento, 'En revisión', hoyString);
        jsonRes['estadoAgendamiento'] = estado;
        return jsonRes;
    }
    async postUsuario(nombre, contraseña, rol, adicional) {
        let usuario = new modelos.Usuario(nombre, contraseña, rol);
        if (typeof adicional == undefined) {
            return usuario;
        }
        else {
            try {
                usuario.adicional = JSON.parse(adicional);
                const query = 'INSERT INTO usuarios(nombre, contraseña, rol, informacionadicional) VALUES ($1, $2, $3, $4)';
                const values = [
                    usuario.nombre,
                    usuario.contraseña,
                    usuario.rol,
                    usuario.adicional,
                ];
                await pool.query(query, values);
                return usuario;
            }
            catch (error) {
                const query = 'INSERT INTO usuarios(nombre, contraseña, rol) VALUES ($1, $2, $3)';
                const values = [usuario.nombre, usuario.contraseña, usuario.rol];
                await pool.query(query, values);
                return usuario;
            }
        }
    }
    async getUsuario(nombre) {
        const query = 'SELECT * FROM usuarios WHERE nombre = $1';
        const values = [nombre];
        const res = await pool.query(query, values);
        const usuario = new modelos.Usuario(res.rows[0].nombre, res.rows[0].contraseña, res.rows[0].rol, res.rows[0].informacionadicional);
        return usuario;
    }
    async verificador(nombre, contraseña) {
        const query = 'SELECT nombre,contraseña FROM usuarios WHERE nombre = $1';
        const values = [nombre];
        try {
            const res = await pool.query(query, values);
            if (res.rows[0].contraseña == contraseña) {
                return true;
            }
            return false;
        }
        catch (error) {
            return false;
        }
    }
    async Query1(fecha1, fecha2) {
        const query = "SELECT idbox FROM box";
        let totalBoxes = 0;
        try {
            const res = await pool.query(query);
            res.rows.forEach(element => {
                totalBoxes += 1;
            });
        }
        catch (error) {
            throw error;
        }
        const fechas = fechador(fecha1, fecha2).split(';');
        const fechasJson = {};
        fechas.forEach(element => {
            fechasJson[element] = 0;
        });
        const query2 = "SELECT (fecha, horaentrada, horasalida) FROM agendamiento WHERE fecha > $1 AND fecha < $2";
        const values = [fecha1, fecha2];
        try {
            const res = await pool.query(query2, values);
            res.rows.forEach(element => {
                let temp = element.row;
                temp = temp.replace('(', '');
                temp = temp.replace(')', '');
                const array = temp.split(',');
                const entrada = array[1].split(':');
                const salida = array[2].split(':');
                fechasJson[array[0]] += (parseInt(salida[0]) - parseInt(entrada[0])) * 60 + (parseInt(salida[1]) - parseInt(entrada[1]));
            });
        }
        catch (error) {
            throw error;
        }
        fechas.forEach(element => {
            try {
                fechasJson[element] /= 930 * totalBoxes;
            }
            catch (error) {
                throw error;
            }
        });
        return fechasJson;
    }
    async Query2(fecha, hora) {
        const query = "SELECT idbox FROM box";
        const boxesJson = {};
        const horaObjetivo = hora.split(':');
        try {
            const res = await pool.query(query);
            res.rows.forEach(element => {
                const temp = {};
                temp['libre'] = true;
                temp['uso'] = 0;
                boxesJson[element.idbox] = temp;
            });
        }
        catch (error) {
            throw error;
        }
        const query2 = "SELECT (idbox, horaentrada, horasalida) FROM agendamiento WHERE fecha = $1";
        const values2 = [fecha];
        try {
            const res = await pool.query(query2, values2);
            res.rows.forEach(element => {
                let temp = element.row;
                temp = temp.replace('(', '');
                temp = temp.replace(')', '');
                const array = temp.split(',');
                const entrada = array[1].split(':');
                const salida = array[2].split(':');
                boxesJson[array[0]]['uso'] += (parseInt(salida[0]) - parseInt(entrada[0])) * 60 + (parseInt(salida[1]) - parseInt(entrada[1]));
                if (horaObjetivo[0] <= salida[0] && horaObjetivo[0] >= entrada[0]) {
                    if (horaObjetivo[0] == salida[0]) {
                        if (horaObjetivo[1] <= salida[1]) {
                            boxesJson[array[0]]['libre'] = false;
                        }
                    }
                    else {
                        if (horaObjetivo[0] == entrada[0]) {
                            if (horaObjetivo[1] >= entrada[1]) {
                                boxesJson[array[0]]['libre'] = false;
                            }
                        }
                        else {
                            boxesJson[array[0]]['libre'] = false;
                        }
                    }
                }
            });
        }
        catch (error) {
            throw error;
        }
        Object.keys(boxesJson).forEach(element => {
            boxesJson[element]['uso'] /= 930;
        });
        return boxesJson;
    }
    async Query3(especialidad, fecha) {
        const query = "SELECT idbox FROM box INNER JOIN especialidadbox ON box.idespecialidadbox = especialidadbox.idespecialidadbox WHERE especialidad = $1";
        const values = [especialidad];
        let totalBoxes = 0;
        try {
            const res = await pool.query(query, values);
            res.rows.forEach(element => {
                totalBoxes += 1;
            });
        }
        catch (error) {
            throw error;
        }
        let resultado = 0;
        const query2 = "SELECT (horaentrada,horasalida) FROM agendamiento AS a INNER JOIN (SELECT idbox,especialidad FROM box INNER JOIN especialidadbox ON especialidadbox.idespecialidadbox = box.idespecialidadbox) AS b ON a.idbox = b.idbox WHERE especialidad = $1 AND fecha = $2";
        const values2 = [especialidad, fecha];
        try {
            const res = await pool.query(query2, values2);
            res.rows.forEach(element => {
                let temp = element.row;
                temp = temp.replace('(', '');
                temp = temp.replace(')', '');
                const array = temp.split(',');
                const entrada = array[0].split(':');
                const salida = array[1].split(':');
                resultado += (parseInt(salida[0]) - parseInt(entrada[0])) * 60 + (parseInt(salida[1]) - parseInt(entrada[1]));
            });
        }
        catch (error) {
            throw error;
        }
        return resultado / (930 * totalBoxes);
    }
    async Query4(fecha, hora) {
        const boxesJson = {};
        const query = "SELECT b.idbox,especialidad FROM box AS b INNER JOIN especialidadbox AS eb ON b.idespecialidadbox = eb.idespecialidadbox";
        try {
            const res = await pool.query(query);
            res.rows.forEach(element => {
                let temp = {};
                temp['especialidad'] = element.especialidad;
                temp['libre'] = true;
                temp['ocupancia'] = 0;
                boxesJson[element.idbox] = temp;
            });
        }
        catch (error) {
            throw error;
        }
        const query2 = "SELECT (a.idbox,especialidad,horaentrada,horasalida) FROM agendamiento AS a INNER JOIN (SELECT idbox,especialidad FROM box INNER JOIN especialidadbox ON especialidadbox.idespecialidadbox = box.idespecialidadbox) AS b ON a.idbox = b.idbox WHERE fecha = $1";
        const values2 = [fecha];
        try {
            const res = await pool.query(query2, values2);
            res.rows.forEach(element => {
                let temp = element.row;
                temp = temp.replace('(', '');
                temp = temp.replace(')', '');
                const array = temp.split(',');
                const entrada = array[2].split(':');
                const salida = array[3].split(':');
                const horaObjetivo = hora.split(':');
                boxesJson[array[0]]['ocupancia'] += (parseInt(salida[0]) - parseInt(entrada[0])) * 60 + (parseInt(salida[1]) - parseInt(entrada[1]));
                if (horaObjetivo[0] <= salida[0] && horaObjetivo[0] >= entrada[0]) {
                    if (horaObjetivo[0] == salida[0]) {
                        if (horaObjetivo[1] <= salida[1]) {
                            boxesJson[array[0]]['libre'] = false;
                        }
                    }
                    else {
                        if (horaObjetivo[0] == entrada[0]) {
                            if (horaObjetivo[1] >= entrada[1]) {
                                boxesJson[array[0]]['libre'] = false;
                            }
                        }
                        else {
                            boxesJson[array[0]]['libre'] = false;
                        }
                    }
                }
            });
        }
        catch (error) {
            throw error;
        }
        Object.keys(boxesJson).forEach(key => {
            boxesJson[key]['ocupancia'] /= 930;
        });
        return boxesJson;
    }
    async postAgendamientoSUPREMUS(fecha, horaEntrada, horaSalida) {
        let jsonRes = {};
        const agendamiento = await (0, simulador_1.simuladorAgendamiento)();
        agendamiento.fecha = fecha;
        agendamiento.horaEntrada = horaEntrada;
        agendamiento.horaSalida = horaSalida;
        const query = 'INSERT INTO agendamiento(idbox, idfuncionario, idpaciente, fecha, horaEntrada, horaSalida) VALUES ($1, $2, $3, $4, $5, $6) RETURNING idagendamiento';
        const values = [agendamiento.idBox, agendamiento.idFuncionario, agendamiento.idPaciente, fecha, horaEntrada, horaSalida];
        try {
            const idAgendamiento = await pool.query(query, values);
            agendamiento.id = idAgendamiento.rows[0].idagendamiento;
        }
        catch (error) {
            console.error(error);
            return false;
        }
        jsonRes['agendamiento'] = agendamiento;
        const query2 = "INSERT INTO estadoagendamiento(idagendamiento, estado, fechaestado) VALUES ($1, $2, $3)";
        let hoy = new Date();
        let hoyString = hoy.toISOString().split('T')[0];
        const values2 = [agendamiento.id, 'En revisión', hoyString];
        try {
            await pool.query(query2, values2);
        }
        catch (error) {
            console.error(error);
            return false;
        }
        jsonRes['estado'] = new modelos.EstadoAgendamiento(agendamiento.id, 'En revisión', hoyString);
        return true;
    }
    async disponibilidad(box, fecha) {
        const query = "SELECT horaentrada FROM agendamiento WHERE idbox = $1 AND fecha = $2";
        const values = [box, fecha];
        let horas = [
            '08:00:00', '08:30:00', '09:00:00', '09:30:00',
            '10:00:00', '10:30:00', '11:00:00', '11:30:00',
            '12:00:00', '12:30:00', '13:00:00', '13:30:00',
            '14:00:00', '14:30:00', '15:00:00', '15:30:00',
            '16:00:00', '16:30:00', '17:00:00', '17:30:00',
            '18:00:00', '18:30:00', '19:00:00', '19:30:00',
            '20:00:00', '20:30:00', '21:00:00', '21:30:00',
            '22:00:00', '22:30:00', '23:00:00', '23:30:00'
        ];
        let conteo = 0;
        try {
            const res = await pool.query(query, values);
            res.rows.forEach(element => {
                conteo += 1;
                if (horas.includes(element.horaentrada)) {
                    let n = horas.indexOf(element.horaentrada);
                    horas.splice(n, 1);
                }
            });
        }
        catch (error) {
            throw error;
        }
        return horas;
    }
    async eliminarAgendamiento(id) {
        const query = "DELETE FROM resultadosconsulta WHERE idagendamiento = $1";
        const values = [id];
        try {
            await pool.query(query, values);
        }
        catch (error) {
            console.error('Error en la eliminación de resultadosconsulta');
            return false;
        }
        const query2 = "DELETE FROM estadoagendamiento WHERE idagendamiento = $1";
        try {
            await pool.query(query2, values);
        }
        catch (error) {
            console.error('Error en la eliminación de estadoagendamiento');
            return false;
        }
        const query3 = "DELETE FROM agendamiento WHERE idagendamiento = $1";
        try {
            await pool.query(query3, values);
            return true;
        }
        catch (error) {
            console.error('Error en la eliminación de agendamiento');
            return false;
        }
    }
    async usoBox(idbox, fecha, hora) {
        let jsonBox = {};
        try {
            jsonBox.id = parseInt(idbox);
        }
        catch (error) {
            throw error;
        }
        jsonBox.ocupancia = 0;
        jsonBox.especialidad = '';
        jsonBox.libre = true;
        jsonBox.proximoBloque = '';
        const query = "SELECT (b.idbox,especialidad) FROM box AS b INNER JOIN especialidadbox AS eb ON b.idespecialidadbox = eb.idespecialidadbox WHERE b.idbox = $1";
        const values = [idbox];
        try {
            const res = await pool.query(query, values);
            let temp = res.rows[0].row.split(',')[1];
            temp = temp.replace(')', '');
            jsonBox.especialidad = temp;
        }
        catch (error) {
            throw error;
        }
        let proximoBloque = true;
        const query2 = "SELECT * FROM agendamiento WHERE idbox = $1 AND fecha = $2 ORDER BY horaentrada";
        const values2 = [idbox, fecha];
        try {
            const res = await pool.query(query2, values2);
            res.rows.forEach(element => {
                jsonBox.ocupancia += 30;
                if (hora == element.horaentrada) {
                    jsonBox.libre = false;
                }
                if (element.horaentrada > hora && proximoBloque) {
                    jsonBox.proximoBloque = element.horaentrada;
                    proximoBloque = false;
                }
            });
        }
        catch (error) {
            throw error;
        }
        jsonBox.ocupancia /= 930;
        return jsonBox;
    }
    async agendamientosPorFecha(fecha) {
        let jsonAgendamientos = {};
        const query = "SELECT idagendamiento,idbox,idfuncionario,idpaciente,horaentrada,horasalida FROM agendamiento WHERE fecha = $1";
        const values = [fecha];
        try {
            const res = await pool.query(query, values);
            res.rows.forEach(element => {
                jsonAgendamientos[element.idagendamiento] = element;
            });
        }
        catch (error) {
            throw error;
        }
        return jsonAgendamientos;
    }
    async updateEstadoSimulaConsulta(idagendamiento) {
        let jsonRes = {};
        const query1 = "UPDATE estadoagendamiento SET estado = 'Aprobado', fechaestado = $1 WHERE idagendamiento = $2";
        let hoy = new Date();
        let hoyString = hoy.toISOString().split('T')[0];
        const values1 = [hoyString, idagendamiento];
        try {
            await pool.query(query1, values1);
            jsonRes['nuevoEstado'] = new modelos.EstadoAgendamiento(idagendamiento, 'Aprobado', hoyString);
        }
        catch (error) {
            throw error;
        }
        const query2 = "SELECT * FROM agendamiento WHERE idagendamiento = $1";
        const values2 = [idagendamiento];
        try {
            const res = await pool.query(query2, values2);
            const temp = res.rows[0];
            const fechaTemp = temp.fecha;
            const fechaTempTemp = fechaTemp.toISOString().split('T')[0];
            const agendamiento = new modelos.Agendamiento(idagendamiento, temp.idbox, temp.idfuncionario, temp.idpaciente, fechaTempTemp, temp.horaentrada, temp.horasalida);
            const resultadosConsulta = await (0, simulador_1.simuladorResultadosConsulta)(agendamiento);
            const query3 = "INSERT INTO resultadosconsulta(idagendamiento, vino, atendido, horaLlegada, vinodate, llamadodate) VALUES ($1, $2, $3, $4, $5, $6)";
            const values3 = [idagendamiento, resultadosConsulta.vino, resultadosConsulta.atendido, resultadosConsulta.horaLlegada, resultadosConsulta.vinoDate, resultadosConsulta.llamadoDate];
            try {
                await pool.query(query3, values3);
                jsonRes['resultadosConsulta'] = resultadosConsulta;
                return jsonRes;
            }
            catch (error) {
                throw error;
            }
        }
        catch (error) {
            throw error;
        }
    }
    async updateEstado(idagendamiento, nuevoEstado) {
        let jsonRes = {};
        const estadoAgendamiento = new modelos.EstadoAgendamiento(-1, '', '');
        const estados = ['Aprobado', 'En revisión', 'Rechazado'];
        if (estados.includes(nuevoEstado)) {
            const query = "UPDATE estadoagendamiento SET estado = $1, fechaestado = $2 WHERE idagendamiento = $3";
            let hoy = new Date();
            let hoyString = hoy.toISOString().split('T')[0];
            const values = [nuevoEstado, hoyString, idagendamiento];
            try {
                await pool.query(query, values);
                estadoAgendamiento.idAgendamiento = idagendamiento;
                estadoAgendamiento.estado = nuevoEstado;
                estadoAgendamiento.fechaEstado = hoyString;
                jsonRes['nuevoEstado'] = estadoAgendamiento;
                return jsonRes;
            }
            catch (error) {
                throw error;
            }
        }
        else {
            return estadoAgendamiento;
        }
    }
    async agendamientosPorConfirmar() {
        const array = [];
        const query = "SELECT a.idagendamiento,idbox,idfuncionario,idpaciente,fecha,horaentrada,horasalida FROM estadoagendamiento AS ea INNER JOIN agendamiento AS a ON ea.idagendamiento = a.idagendamiento WHERE estado = 'En revisión' ";
        try {
            const res = await pool.query(query);
            res.rows.forEach(element => {
                let temp = new modelos.Agendamiento(element.idagendamiento, element.idbox, element.idfuncionario, element.idpaciente, element.fecha, element.horaentrada, element.horasalida);
                array.push(temp);
            });
            return array;
        }
        catch (error) {
            throw error;
        }
    }
    async boxesLibres(fecha, hora) {
        const array = [];
        const query = "SELECT * FROM box";
        try {
            let res = await pool.query(query);
            res = res.rows;
            const query2 = "SELECT b.idbox,idespecialidadbox,pasillo FROM box AS b INNER JOIN agendamiento AS a ON b.idbox = a.idbox WHERE fecha = $1 AND horaentrada = $2";
            const values2 = [fecha, hora];
            try {
                let res2 = await pool.query(query2, values2);
                res2 = res2.rows;
                res2.forEach(element => {
                    res = res.filter((item) => item.idbox !== element.idbox);
                });
                return res;
            }
            catch (error) {
                throw error;
            }
        }
        catch (error) {
            throw error;
        }
    }
    async cambioAgendamiento(fecha1, fecha2) {
        const jsonRes = {};
        const query = "SELECT COUNT(*) FROM box";
        let totalBoxes = 0;
        try {
            const res = await pool.query(query);
            totalBoxes = res.rows[0].count;
        }
        catch (error) {
            throw error;
        }
        let ocupanciaFecha1 = 0;
        let ocupanciaFecha2 = 0;
        const query2 = "SELECT fecha, horaentrada,horasalida FROM agendamiento WHERE fecha = $1";
        try {
            const res = await pool.query(query2, [fecha1]);
            res.rows.forEach(element => {
                const entrada = element.horaentrada.split(':');
                const salida = element.horasalida.split(':');
                ocupanciaFecha1 += (parseInt(salida[0]) - parseInt(entrada[0])) * 60 + (parseInt(salida[1]) - parseInt(entrada[1]));
            });
        }
        catch (error) {
            throw error;
        }
        try {
            const res = await pool.query(query2, [fecha2]);
            res.rows.forEach(element => {
                const entrada = element.horaentrada.split(':');
                const salida = element.horasalida.split(':');
                ocupanciaFecha2 += (parseInt(salida[0]) - parseInt(entrada[0])) * 60 + (parseInt(salida[1]) - parseInt(entrada[1]));
            });
        }
        catch (error) {
            throw error;
        }
        jsonRes['diferenciaMinutos'] = ocupanciaFecha2 - ocupanciaFecha1;
        jsonRes['porcentajeDiferencia'] = ocupanciaFecha2 / 930 * totalBoxes - ocupanciaFecha1 / 930 * totalBoxes;
        return jsonRes;
    }
    async agendamientoTotalHoyBox(idbox, fecha) {
        const query1 = "SELECT * FROM agendamiento WHERE idbox = $1 AND fecha = $2";
        const values = [idbox, fecha];
        try {
            const res = await pool.query(query1, values);
            return res.rows;
        }
        catch (error) {
            throw error;
        }
    }
    async agendamientosPendientesBox(idbox, fecha) {
        const query1 = "SELECT * FROM agendamiento AS a INNER JOIN estadoagendamiento AS ea ON a.idagendamiento = ea.idagendamiento WHERE idbox = $1 AND fecha = $2 AND estado = 'En revisión'";
        const values = [idbox, fecha];
        try {
            const res = await pool.query(query1, values);
            return res.rows;
        }
        catch (error) {
            throw error;
        }
    }
    async proximoAgendamientoBox(idbox, fecha, hora) {
        const query1 = "SELECT horaentrada FROM agendamiento WHERE idbox = $1 AND fecha = $2 AND horaentrada > $3 ORDER BY horaentrada";
        const values1 = [idbox, fecha, hora];
        try {
            const res = await pool.query(query1, values1);
            return res.rows[0].horaentrada;
        }
        catch (error) {
            throw error;
        }
    }
    async cantidadAgendamientosEntreFechas(fecha1, fecha2) {
        const query1 = "SELECT COUNT(*) FROM agendamiento WHERE fecha >= $1 AND fecha <= $2";
        const values1 = [fecha1, fecha2];
        try {
            const res = await pool.query(query1, values1);
            return res.rows[0].count;
        }
        catch (error) {
            throw error;
        }
    }
    async funcionariosFull() {
        const query1 = "SELECT * FROM funcionario AS f INNER JOIN tipofuncionario AS tf ON f.idtipofuncionario = tf.idtipofuncionario";
        try {
            const res = await pool.query(query1);
            return res.rows;
        }
        catch (error) {
            throw error;
        }
    }
    async pacientesNoAtendidos(fecha) {
        const query1 = "SELECT a.idagendamiento,idbox,idfuncionario,idpaciente,fecha,horaentrada,horasalida,vino FROM agendamiento AS a INNER JOIN resultadosconsulta AS rc ON a.idagendamiento = rc.idagendamiento WHERE fecha = $1 AND atendido=false";
        const values1 = [fecha];
        try {
            const res = await pool.query(query1, values1);
            return res.rows;
        }
        catch (error) {
            throw error;
        }
    }
    async pacientesAtendidos(fecha) {
        const query1 = "SELECT a.idagendamiento,idbox,idfuncionario,idpaciente,fecha,horaentrada,horasalida FROM agendamiento AS a INNER JOIN resultadosconsulta AS rc ON a.idagendamiento = rc.idagendamiento WHERE fecha = $1 AND atendido=true";
        const values1 = [fecha];
        try {
            const res = await pool.query(query1, values1);
            return res.rows;
        }
        catch (error) {
            throw error;
        }
    }
    async diferenciaOcupanciaMeses(mes1, mes2) {
        const query1 = "SELECT COUNT(*) FROM agendamiento WHERE fecha >= $1 AND fecha <= $2";
        let mes1Array = mes1.split('-');
        let mes2Array = mes2.split('-');
        let mes1Max = '';
        let mes1Min = '';
        let mes2Max = '';
        let mes2Min = '';
        mes1Max += mes1Array[0] + '-' + mes1Array[1] + '-';
        mes2Max += mes2Array[0] + '-' + mes2Array[1] + '-';
        mes1Min += mes1Array[0] + '-' + mes1Array[1] + '-01';
        mes2Min += mes2Array[0] + '-' + mes2Array[1] + '-01';
        let dias1 = 0;
        let dias2 = 0;
        if (mes1Array[1] == '02') {
            dias1 = 28;
            mes1Max += '28';
        }
        else {
            if (meses30.includes(mes1Array[1])) {
                dias1 = 30;
                mes1Max += '30';
            }
            else {
                dias1 = 31;
                mes1Max += '31';
            }
        }
        if (mes2Array[1] == '02') {
            dias2 = 28;
            mes2Max += '28';
        }
        else {
            if (meses30.includes(mes2Array[1])) {
                dias2 = 30;
                mes2Max += '30';
            }
            else {
                dias2 = 31;
                mes2Max += '31';
            }
        }
        const values1 = [mes1Min, mes1Max];
        const values2 = [mes2Min, mes2Max];
        const query2 = "SELECT COUNT(*) FROM box";
        try {
            const totalBoxes = await pool.query(query2);
            const res = await pool.query(query1, values1);
            const res2 = await pool.query(query1, values2);
            console.log((res2.rows[0].count * 30) / (930 * dias2));
            return (res2.rows[0].count * 30) / (930 * dias2 * totalBoxes.rows[0].count) - (res.rows[0].count * 30) / (930 * dias1 * totalBoxes.rows[0].count);
        }
        catch (error) {
            throw error;
        }
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map