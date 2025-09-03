"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const fs_1 = require("fs");
const path_1 = require("path");
const meses30 = ['04', '06', '09', '11'];
const meses31 = ['01', '03', '05', '07', '08', '10', '12'];
function fechador(fecha1, fecha2) {
    if (fecha1 == fecha2) {
        return fecha2;
    }
    console.log(fecha1);
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
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    getPrincipal(res) {
        const htmlPath = (0, path_1.join)(__dirname, '../src/index.html');
        const html = (0, fs_1.readFileSync)(htmlPath);
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    }
    getIndex(res) {
        const htmlPath = (0, path_1.join)(__dirname, '../src/index2.html');
        const html = (0, fs_1.readFileSync)(htmlPath);
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    }
    async getEspecialidadBox() {
        return this.appService.getEspecialidadBox();
    }
    async getTipoFuncionario() {
        return this.appService.getTipoFuncionario();
    }
    async getPaciente() {
        return this.appService.getPaciente();
    }
    async getBox() {
        return this.appService.getBox();
    }
    async getFuncionario() {
        return this.appService.getFuncionario();
    }
    async getAgendamiento() {
        return this.appService.getAgendamiento();
    }
    async getResultadosConsulta() {
        return this.appService.getResultadosConsulta();
    }
    async getEstadoAgendamiento() {
        return this.getEstadoAgendamiento();
    }
    async simularPersona() {
        return this.appService.postPaciente();
    }
    async simularBox() {
        return this.appService.postBox();
    }
    async simularFuncionario() {
        return this.appService.postFuncionario();
    }
    async simularAgendamiento() {
        return this.appService.postAgendamiento();
    }
    async simularTodo() {
        for (let i = 0; i < 2000; i++) {
            await this.appService.postPaciente();
            await this.appService.postBox();
            await this.appService.postAgendamiento();
            await this.appService.postFuncionario();
        }
        return Object();
    }
    async getAgendamientoEspecialidad(especialidad) {
        return this.appService.getAgendamientoEspecialidad(especialidad);
    }
    async getAllAgendamientoEspecialidad() {
        return this.appService.getCountAgendamientosPorEspecialidad();
    }
    async getCountAgendamientoEspecialidadRangoFechas(fecha_inicio, fecha_final) {
        return this.appService.getCountAgendamientosPorEspecialidadRangoFechas(fecha_inicio, fecha_final);
    }
    async getAgendamientoFecha(fecha1, fecha2) {
        return this.appService.getAgendamientoFecha(fecha1, fecha2);
    }
    async getAgendamientoEspecialidadFecha(especialidad, fecha1, fecha2) {
        return this.appService.getAgendamientoEspecialidadFecha(especialidad, fecha1, fecha2);
    }
    async postAgendamientoPersonalizado(idBox, idFuncionario, idPaciente, fecha, horaEntrada, horaSalida) {
        return this.appService.postAgendamientoPersonalizado(idBox, idFuncionario, idPaciente, fecha, horaEntrada, horaSalida);
    }
    async postUsuario(nombre, contraseña, rol, adicional) {
        return this.appService.postUsuario(nombre, contraseña, rol, adicional);
    }
    async postUsuario2(nombre, contraseña, rol) {
        return this.appService.postUsuario(nombre, contraseña, rol);
    }
    async getUsuario(nombre) {
        return this.appService.getUsuario(nombre);
    }
    async verificador(nombre, contraseña) {
        return this.appService.verificador(nombre, contraseña);
    }
    async Query1(fecha1, fecha2) {
        return this.appService.Query1(fecha1, fecha2);
    }
    async Query2(fecha, hora) {
        return this.appService.Query2(fecha, hora);
    }
    async Query3(especialidad, fecha) {
        return this.appService.Query3(especialidad, fecha);
    }
    async Query4(fecha, hora) {
        return this.appService.Query4(fecha, hora);
    }
    async postAgendamientoSUPREMUS(fecha1, fecha2) {
        const array = fechador(fecha1, fecha2);
        let temp = array.split(';');
        const horas = [
            '08:00:00', '08:30:00', '09:00:00', '09:30:00',
            '10:00:00', '10:30:00', '11:00:00', '11:30:00',
            '12:00:00', '12:30:00', '13:00:00', '13:30:00',
            '14:00:00', '14:30:00', '15:00:00', '15:30:00',
            '16:00:00', '16:30:00', '17:00:00', '17:30:00',
            '18:00:00', '18:30:00', '19:00:00', '19:30:00',
            '20:00:00', '20:30:00', '21:00:00', '21:30:00',
            '22:00:00', '22:30:00', '23:00:00', '23:30:00'
        ];
        try {
            temp.forEach(fecha => {
                let index = 1;
                horas.forEach(h => {
                    if (h != '23:30:00') {
                        const res = this.appService.postAgendamientoSUPREMUS(fecha, h, horas[index]);
                        index += 1;
                    }
                });
            });
            return 1;
        }
        catch (error) {
            throw error;
        }
    }
    async disponibilidad(fecha, box) {
        return this.appService.disponibilidad(box, fecha);
    }
    async eliminarAgendamiento(id) {
        return this.appService.eliminarAgendamiento(id);
    }
    async usoBox(idbox, fecha, hora) {
        return this.appService.usoBox(idbox, fecha, hora);
    }
    async agendamientosFecha(fecha) {
        return this.appService.agendamientosPorFecha(fecha);
    }
    async updateEstado(idagendamiento, nuevoEstado) {
        return this.appService.updateEstado(idagendamiento, nuevoEstado);
    }
    async updateEstadoSimulaConsulta(idagendamiento) {
        return this.appService.updateEstadoSimulaConsulta(idagendamiento);
    }
    async agendamientosPorConfirmar() {
        return this.appService.agendamientosPorConfirmar();
    }
    async boxesLibres(fecha, hora) {
        return this.appService.boxesLibres(fecha, hora);
    }
    async cambioAgendamiento(fecha1, fecha2) {
        return this.appService.cambioAgendamiento(fecha1, fecha2);
    }
    async agendamientoTotalHoyBox(idbox, fecha) {
        return this.appService.agendamientoTotalHoyBox(idbox, fecha);
    }
    async agendamientosPendientesBox(idbox, fecha) {
        return this.appService.agendamientosPendientesBox(idbox, fecha);
    }
    async proximoAgendamientoBox(idbox, fecha, hora) {
        return this.appService.proximoAgendamientoBox(idbox, fecha, hora);
    }
    async cantidadAgendamientosEntreFechas(fecha1, fecha2) {
        return this.appService.cantidadAgendamientosEntreFechas(fecha1, fecha2);
    }
    async funcionariosFull() {
        return this.appService.funcionariosFull();
    }
    async pacientesNoAtendidos(fecha) {
        return this.appService.pacientesNoAtendidos(fecha);
    }
    async pacientesAtendidos(fecha) {
        return this.appService.pacientesAtendidos(fecha);
    }
    async diferenciaOcupanciaMeses(mes1, mes2) {
        return this.appService.diferenciaOcupanciaMeses(mes1, mes2);
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getPrincipal", null);
__decorate([
    (0, common_1.Get)('home'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getIndex", null);
__decorate([
    (0, common_1.Get)('/especialidadBox'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getEspecialidadBox", null);
__decorate([
    (0, common_1.Get)('tipoFuncionario'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getTipoFuncionario", null);
__decorate([
    (0, common_1.Get)('paciente'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getPaciente", null);
__decorate([
    (0, common_1.Get)('box'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getBox", null);
__decorate([
    (0, common_1.Get)('funcionario'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getFuncionario", null);
__decorate([
    (0, common_1.Get)('agendamiento'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAgendamiento", null);
__decorate([
    (0, common_1.Get)('resultadosConsulta'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getResultadosConsulta", null);
__decorate([
    (0, common_1.Get)('estadoAgendamiento'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getEstadoAgendamiento", null);
__decorate([
    (0, common_1.Get)('simulacion/paciente'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "simularPersona", null);
__decorate([
    (0, common_1.Get)('simulacion/box'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "simularBox", null);
__decorate([
    (0, common_1.Get)('simulacion/funcionario'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "simularFuncionario", null);
__decorate([
    (0, common_1.Get)('simulacion/agendamiento'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "simularAgendamiento", null);
__decorate([
    (0, common_1.Get)('simulacion/get-everything'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "simularTodo", null);
__decorate([
    (0, common_1.Get)('tomah/agendamiento-especialidad/:especialidad'),
    __param(0, (0, common_1.Param)('especialidad')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAgendamientoEspecialidad", null);
__decorate([
    (0, common_1.Get)('tomah/agendamientos-por-especialidad/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAllAgendamientoEspecialidad", null);
__decorate([
    (0, common_1.Get)('tomah/agendamientos-por-especialidad-rango-fechas/:fecha_inicio/:fecha_final'),
    __param(0, (0, common_1.Param)('fecha_inicio')),
    __param(1, (0, common_1.Param)('fecha_final')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getCountAgendamientoEspecialidadRangoFechas", null);
__decorate([
    (0, common_1.Get)('tomah/agendamiento-fecha/:fecha1/:fecha2'),
    __param(0, (0, common_1.Param)('fecha1')),
    __param(1, (0, common_1.Param)('fecha2')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAgendamientoFecha", null);
__decorate([
    (0, common_1.Get)('tomah/agendamiento-especialidadfechas/:especialidad/:fecha1/:fecha2'),
    __param(0, (0, common_1.Param)('especialidad')),
    __param(1, (0, common_1.Param)('fecha1')),
    __param(2, (0, common_1.Param)('fecha2')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAgendamientoEspecialidadFecha", null);
__decorate([
    (0, common_1.Get)('tomah/posteoPersonalizado/:idBox/:idFuncionario/:idPaciente/:fecha/:horaEntrada/:horaSalida'),
    __param(0, (0, common_1.Param)('idBox')),
    __param(1, (0, common_1.Param)('idFuncionario')),
    __param(2, (0, common_1.Param)('idPaciente')),
    __param(3, (0, common_1.Param)('fecha')),
    __param(4, (0, common_1.Param)('horaEntrada')),
    __param(5, (0, common_1.Param)('horaSalida')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "postAgendamientoPersonalizado", null);
__decorate([
    (0, common_1.Get)('usuarios/post/:nombre/:contraseña/:rol/:adicional'),
    __param(0, (0, common_1.Param)('nombre')),
    __param(1, (0, common_1.Param)('contraseña')),
    __param(2, (0, common_1.Param)('rol')),
    __param(3, (0, common_1.Param)('adicional')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "postUsuario", null);
__decorate([
    (0, common_1.Get)('usuarios/post/:nombre/:contraseña/:rol'),
    __param(0, (0, common_1.Param)('nombre')),
    __param(1, (0, common_1.Param)('contraseña')),
    __param(2, (0, common_1.Param)('rol')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "postUsuario2", null);
__decorate([
    (0, common_1.Get)('usuarios/get/:nombre'),
    __param(0, (0, common_1.Param)('nombre')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getUsuario", null);
__decorate([
    (0, common_1.Get)('usuarios/get/:nombre/:contraseña'),
    __param(0, (0, common_1.Param)('nombre')),
    __param(1, (0, common_1.Param)('contraseña')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "verificador", null);
__decorate([
    (0, common_1.Get)('tomah/query1/:fecha1/:fecha2'),
    __param(0, (0, common_1.Param)('fecha1')),
    __param(1, (0, common_1.Param)('fecha2')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "Query1", null);
__decorate([
    (0, common_1.Get)('tomah/query2/:fecha/:hora'),
    __param(0, (0, common_1.Param)('fecha')),
    __param(1, (0, common_1.Param)('hora')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "Query2", null);
__decorate([
    (0, common_1.Get)('tomah/query3/:especialidad/:fecha'),
    __param(0, (0, common_1.Param)('especialidad')),
    __param(1, (0, common_1.Param)('fecha')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "Query3", null);
__decorate([
    (0, common_1.Get)('tomah/query4/:fecha/:hora'),
    __param(0, (0, common_1.Param)('fecha')),
    __param(1, (0, common_1.Param)('hora')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "Query4", null);
__decorate([
    (0, common_1.Get)('/simulacion/postSUPREMUS/:fecha1/:fecha2'),
    __param(0, (0, common_1.Param)('fecha1')),
    __param(1, (0, common_1.Param)('fecha2')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "postAgendamientoSUPREMUS", null);
__decorate([
    (0, common_1.Get)('horasDisponibles/:box/:fecha'),
    __param(0, (0, common_1.Param)('fecha')),
    __param(1, (0, common_1.Param)('box')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "disponibilidad", null);
__decorate([
    (0, common_1.Get)('eliminarAgendamiento/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "eliminarAgendamiento", null);
__decorate([
    (0, common_1.Get)('usoBox/:idbox/:fecha/:hora'),
    __param(0, (0, common_1.Param)('idbox')),
    __param(1, (0, common_1.Param)('fecha')),
    __param(2, (0, common_1.Param)('hora')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "usoBox", null);
__decorate([
    (0, common_1.Get)('agendamientosFecha/:fecha'),
    __param(0, (0, common_1.Param)('fecha')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "agendamientosFecha", null);
__decorate([
    (0, common_1.Get)('updateEstado/:idagendamiento/:nuevoEstado'),
    __param(0, (0, common_1.Param)('idagendamiento')),
    __param(1, (0, common_1.Param)('nuevoEstado')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateEstado", null);
__decorate([
    (0, common_1.Get)('updateEstadoSimulaConsulta/:idagendamiento'),
    __param(0, (0, common_1.Param)('idagendamiento')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateEstadoSimulaConsulta", null);
__decorate([
    (0, common_1.Get)('agendamientosPorConfirmar/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "agendamientosPorConfirmar", null);
__decorate([
    (0, common_1.Get)('boxesLibres/:fecha/:hora'),
    __param(0, (0, common_1.Param)('fecha')),
    __param(1, (0, common_1.Param)('hora')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "boxesLibres", null);
__decorate([
    (0, common_1.Get)('cambioAgendamiento/:fecha1/:fecha2'),
    __param(0, (0, common_1.Param)('fecha1')),
    __param(1, (0, common_1.Param)('fecha2')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "cambioAgendamiento", null);
__decorate([
    (0, common_1.Get)('agendamientoTotalHoyBox/:idbox/:fecha'),
    __param(0, (0, common_1.Param)('idbox')),
    __param(1, (0, common_1.Param)('fecha')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "agendamientoTotalHoyBox", null);
__decorate([
    (0, common_1.Get)('agendamientosPendientesBox/:idbox/:fecha'),
    __param(0, (0, common_1.Param)('idbox')),
    __param(1, (0, common_1.Param)('fecha')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "agendamientosPendientesBox", null);
__decorate([
    (0, common_1.Get)('proximoAgendamiento/:idbox/:fecha/:hora'),
    __param(0, (0, common_1.Param)('idbox')),
    __param(1, (0, common_1.Param)('fecha')),
    __param(2, (0, common_1.Param)('hora')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "proximoAgendamientoBox", null);
__decorate([
    (0, common_1.Get)('cantidadAgendamientosRango/:fecha1/:fecha2'),
    __param(0, (0, common_1.Param)('fecha1')),
    __param(1, (0, common_1.Param)('fecha2')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "cantidadAgendamientosEntreFechas", null);
__decorate([
    (0, common_1.Get)('/funcionarioFull'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "funcionariosFull", null);
__decorate([
    (0, common_1.Get)('/pacientesNoAtendidos/:fecha'),
    __param(0, (0, common_1.Param)('fecha')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "pacientesNoAtendidos", null);
__decorate([
    (0, common_1.Get)('pacientesAtendidos/:fecha'),
    __param(0, (0, common_1.Param)('fecha')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "pacientesAtendidos", null);
__decorate([
    (0, common_1.Get)('diferenciaOcupanciaEntreMeses/:mes1/:mes2'),
    __param(0, (0, common_1.Param)('mes1')),
    __param(1, (0, common_1.Param)('mes2')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "diferenciaOcupanciaMeses", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map