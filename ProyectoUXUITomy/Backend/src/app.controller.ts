import { Controller, Get, Res, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as modelos from './models/modelos'

const meses30 = ['04', '06', '09', '11']
const meses31 = ['01', '03', '05', '07', '08', '10', '12']
function fechador(fecha1:string, fecha2:string) {
  if (fecha1 == fecha2){
    return fecha2
  }
  console.log(fecha1)
  const temp = fecha1.split('-')

  if (temp[1] == '02' && temp[2] == '28'){
    temp[1] = '03'
    temp[2] = '01'
  }else{
    if (meses30.includes(temp[1]) && temp[2] == '30'){
      temp[2] = '01'
      if (parseInt(temp[1]) < 9) {
        temp[1] = '0'+String(parseInt(temp[1])+1)
      }else{
        temp[1] = String(parseInt(temp[1])+1)
      }
    }else {
      if (meses31.includes(temp[1]) && temp[2] == '31'){
        temp[2] = '01'
        if (temp[1] == '12'){
          temp[0] = String(parseInt(temp[0])+1)
          temp[1] = '01'
        }else{
          if (parseInt(temp[1]) < 9) {
            temp[1] = '0'+String(parseInt(temp[1])+1)
          }else{
            temp[1] = String(parseInt(temp[1])+1)
          }
        }
      }else {
        if (parseInt(temp[2]) < 9){
          temp[2] = '0'+String(parseInt(temp[2])+1)
        }else{
          temp[2] = String(parseInt(temp[2])+1)
        }
      }
    }
  }

  const fechaTemp = temp[0]+'-'+temp[1]+'-'+temp[2]
  return fecha1+';'+fechador(fechaTemp,fecha2)
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Principal
  @Get()
  getPrincipal(@Res() res: Response) {
    const htmlPath = join(__dirname, '../src/index.html');
    const html = readFileSync(htmlPath);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  @Get('home')
  getIndex(@Res() res: Response) {
    const htmlPath = join(__dirname, '../src/index2.html');
    const html = readFileSync(htmlPath);
    res.setHeader('Content-Type', 'text/html');
    res.send(html)
  }

  // APIs Get
  @Get('/especialidadBox')
  async getEspecialidadBox(): Promise<object> {
    return this.appService.getEspecialidadBox();
  }

  @Get('tipoFuncionario')
  async getTipoFuncionario(): Promise<object> {
    return this.appService.getTipoFuncionario();
  }

  @Get('paciente')
  async getPaciente(): Promise<object> {
    return this.appService.getPaciente();
  }

  @Get('box')
  async getBox(): Promise<object> {
    return this.appService.getBox();
  }

  @Get('funcionario')
  async getFuncionario(): Promise<object> {
    return this.appService.getFuncionario();
  }

  @Get('agendamiento')
  async getAgendamiento(): Promise<object> {
    return this.appService.getAgendamiento();
  }

  @Get('resultadosConsulta')
  async getResultadosConsulta(): Promise<object> {
    return this.appService.getResultadosConsulta();
  }

  @Get('estadoAgendamiento')
  async getEstadoAgendamiento(): Promise<object> {
    return this.getEstadoAgendamiento();
  }

  // Simulación
  @Get('simulacion/paciente')
  async simularPersona(): Promise<object> {
    return this.appService.postPaciente();
  }

  @Get('simulacion/box')
  async simularBox(): Promise<object> {
    return this.appService.postBox();
  }

  @Get('simulacion/funcionario')
  async simularFuncionario(): Promise<object> {
    return this.appService.postFuncionario();
  }

  @Get('simulacion/agendamiento')
  async simularAgendamiento(): Promise<object> {
    return this.appService.postAgendamiento();
  }

  @Get('simulacion/get-everything')
  async simularTodo(): Promise<object> {
    for (let i = 0; i < 2000; i++) {
      await this.appService.postPaciente();
      await this.appService.postBox();
      await this.appService.postAgendamiento();
      await this.appService.postFuncionario();
    }

    return Object();
  }

  // APIs pal front del tomah
  @Get('tomah/agendamiento-especialidad/:especialidad')
  async getAgendamientoEspecialidad(
    @Param('especialidad') especialidad: string,
  ): Promise<object> {
    return this.appService.getAgendamientoEspecialidad(especialidad);
  }
  @Get('tomah/agendamientos-por-especialidad/')
  async getAllAgendamientoEspecialidad(): Promise<object> {
    return this.appService.getCountAgendamientosPorEspecialidad();
  }

  @Get(
    'tomah/agendamientos-por-especialidad-rango-fechas/:fecha_inicio/:fecha_final',
  )
  async getCountAgendamientoEspecialidadRangoFechas(
    @Param('fecha_inicio') fecha_inicio: string,
    @Param('fecha_final') fecha_final: string,
  ): Promise<object> {
    return this.appService.getCountAgendamientosPorEspecialidadRangoFechas(fecha_inicio, fecha_final);
  }

  @Get('tomah/agendamiento-fecha/:fecha1/:fecha2')
  async getAgendamientoFecha(
    @Param('fecha1') fecha1: string,
    @Param('fecha2') fecha2: string,
  ): Promise<object> {
    return this.appService.getAgendamientoFecha(fecha1, fecha2);
  }

  @Get('tomah/agendamiento-especialidadfechas/:especialidad/:fecha1/:fecha2')
  async getAgendamientoEspecialidadFecha(
    @Param('especialidad') especialidad: string,
    @Param('fecha1') fecha1: string,
    @Param('fecha2') fecha2: string,
  ): Promise<object> {
    return this.appService.getAgendamientoEspecialidadFecha(
      especialidad,
      fecha1,
      fecha2,
    );
  }

  @Get(
    'tomah/posteoPersonalizado/:idBox/:idFuncionario/:idPaciente/:fecha/:horaEntrada/:horaSalida',
  )
  async postAgendamientoPersonalizado(
    @Param('idBox') idBox: number,
    @Param('idFuncionario') idFuncionario: number,
    @Param('idPaciente') idPaciente: number,
    @Param('fecha') fecha: string,
    @Param('horaEntrada') horaEntrada: string,
    @Param('horaSalida') horaSalida: string,
  ): Promise<object> {
    return this.appService.postAgendamientoPersonalizado(
      idBox,
      idFuncionario,
      idPaciente,
      fecha,
      horaEntrada,
      horaSalida,
    );
  }

  // Control de usuarios
  @Get('usuarios/post/:nombre/:contraseña/:rol/:adicional')
  async postUsuario(
    @Param('nombre') nombre: string,
    @Param('contraseña') contraseña: string,
    @Param('rol') rol: string,
    @Param('adicional') adicional: JSON,
  ): Promise<object> {
    return this.appService.postUsuario(nombre, contraseña, rol, adicional);
  }

  @Get('usuarios/post/:nombre/:contraseña/:rol')
  async postUsuario2(
    @Param('nombre') nombre: string,
    @Param('contraseña') contraseña: string,
    @Param('rol') rol: string,
  ): Promise<object> {
    return this.appService.postUsuario(nombre, contraseña, rol);
  }

  @Get('usuarios/get/:nombre')
  async getUsuario(@Param('nombre') nombre: string): Promise<object> {
    return this.appService.getUsuario(nombre);
  }

  @Get('usuarios/get/:nombre/:contraseña')
  async verificador(
    @Param('nombre') nombre: string,
    @Param('contraseña') contraseña: string,
  ): Promise<boolean> {
    return this.appService.verificador(nombre, contraseña);
  }

  @Get('tomah/query1/:fecha1/:fecha2')
  // Porcentaje de ocupancia total (todos los boxes) diaria entre fechas
  async Query1(
    @Param('fecha1') fecha1: string,
    @Param('fecha2') fecha2: string
  ): Promise<object> {
    return this.appService.Query1(fecha1, fecha2)
  }

  @Get('tomah/query2/:fecha/:hora')
  // Porcentaje de uso y si el box esta libre o no ahora, retorna todos los boxes
  async Query2(
    @Param('fecha') fecha:string,
    @Param('hora') hora:string
  ): Promise<object> {
    return this.appService.Query2(fecha, hora)
  }

  @Get('tomah/query3/:especialidad/:fecha')
  // Porcentaje de ocupancia de todos los boxes de una especialidad en un dia
  async Query3(
    @Param('especialidad') especialidad:string,
    @Param('fecha') fecha:string
  ): Promise<number> {
    return this.appService.Query3(especialidad, fecha)
  }

  @Get('tomah/query4/:fecha/:hora')
  // Porcentaje de uso, si el box esta libre o no ahora y su respectiva especialidad, retorna todos los boxes
  async Query4(
    @Param('fecha') fecha:string,
    @Param('hora') hora:string
  ): Promise<object> {
    return this.appService.Query4(fecha, hora)
  }

  @Get('/simulacion/postSUPREMUS/:fecha1/:fecha2')
  async postAgendamientoSUPREMUS(
    @Param('fecha1') fecha1:string,
    @Param('fecha2') fecha2:string
  ): Promise<number> {
    const array = fechador(fecha1, fecha2) 
    let temp = array.split(';')
    const horas = [
      '08:00:00','08:30:00','09:00:00','09:30:00',
      '10:00:00','10:30:00','11:00:00','11:30:00',
      '12:00:00','12:30:00','13:00:00','13:30:00',
      '14:00:00','14:30:00','15:00:00','15:30:00',
      '16:00:00','16:30:00','17:00:00','17:30:00',
      '18:00:00','18:30:00','19:00:00','19:30:00',
      '20:00:00','20:30:00','21:00:00','21:30:00',
      '22:00:00','22:30:00','23:00:00','23:30:00'
    ]
    try {
      temp.forEach(fecha => {
        let index = 1
        horas.forEach(h => {
          if (h != '23:30:00'){
            const res = this.appService.postAgendamientoSUPREMUS(fecha, h, horas[index])
            index += 1
          }
        })
      });
      return 1
    } catch (error) {
        throw error
    }
  }

  @Get('horasDisponibles/:box/:fecha')
  async disponibilidad(
    @Param('fecha') fecha:string,
    @Param('box') box:number
  ): Promise<Array<string>> {
    return this.appService.disponibilidad(box, fecha)
  }

  @Get('eliminarAgendamiento/:id')
  // Eliminar un agendamiento
  async eliminarAgendamiento(
    @Param('id') id:number
  ): Promise<boolean> {
    return this.appService.eliminarAgendamiento(id)
  }

  @Get('usoBox/:idbox/:fecha/:hora')
  // ocupancia, especialidad, libre ahora?, proxima hora : Por box
  async usoBox(
    @Param('idbox') idbox:string,
    @Param('fecha') fecha:string,
    @Param('hora') hora:string,
  ): Promise<object> {
    return this.appService.usoBox(idbox, fecha, hora)
  }

  @Get('agendamientosFecha/:fecha')
  // Todos los agendamientos de la fecha
  async agendamientosFecha(
    @Param('fecha') fecha:string
  ): Promise<object> {
    return this.appService.agendamientosPorFecha(fecha)
  }

  @Get('updateEstado/:idagendamiento/:nuevoEstado')
  async updateEstado(
    @Param('idagendamiento') idagendamiento:number,
    @Param('nuevoEstado') nuevoEstado:string,
  ): Promise<object> {
    return this.appService.updateEstado(idagendamiento, nuevoEstado)
  }

  @Get('updateEstadoSimulaConsulta/:idagendamiento')
  async updateEstadoSimulaConsulta(
    @Param('idagendamiento') idagendamiento:number
  ): Promise<object> {
    return this.appService.updateEstadoSimulaConsulta(idagendamiento)
  }

  @Get('agendamientosPorConfirmar/')
  // Agendamientos por confirmar
  async agendamientosPorConfirmar(): Promise<Array<modelos.Agendamiento>> {
    return this.appService.agendamientosPorConfirmar()
  }

  @Get('boxesLibres/:fecha/:hora')
  // Boxes libres ahora
  async boxesLibres(
    @Param('fecha') fecha:string,
    @Param('hora') hora:string
  ): Promise<object> {
    return this.appService.boxesLibres(fecha, hora)
  }

  @Get('cambioAgendamiento/:fecha1/:fecha2')
  // Cambio en la ocupancia de de fecha1 a fecha2
  async cambioAgendamiento(
    @Param('fecha1') fecha1:string,
    @Param('fecha2') fecha2:string
  ): Promise<object> {
    return this.appService.cambioAgendamiento(fecha1, fecha2)
  }

  @Get('agendamientoTotalHoyBox/:idbox/:fecha')
  // Agendamientos totales hoy en un box
  async agendamientoTotalHoyBox(
    @Param('idbox') idbox:number,
    @Param('fecha') fecha:string
  ): Promise<object> {
    return this.appService.agendamientoTotalHoyBox(idbox, fecha)
  }

  @Get('agendamientosPendientesBox/:idbox/:fecha')
  // Peticiones de agendamiento en 'fecha' en el 'box' especifico
  async agendamientosPendientesBox(
    @Param('idbox') idbox:number,
    @Param('fecha') fecha:string
  ): Promise<object> {
    return this.appService.agendamientosPendientesBox(idbox, fecha)
  }

  @Get('proximoAgendamiento/:idbox/:fecha/:hora')
  // Proximo agendamiento del 'box' en la 'fecha'
  async proximoAgendamientoBox(
    @Param('idbox') idbox: number,
    @Param('fecha') fecha: string,
    @Param('hora') hora: string
  ): Promise<string> {
    return this.appService.proximoAgendamientoBox(idbox, fecha, hora)
  }

  @Get('cantidadAgendamientosRango/:fecha1/:fecha2')
  // Cantidad de agendamientos entre 'fecha1' y 'fecha2'
  async cantidadAgendamientosEntreFechas(
    @Param('fecha1') fecha1:string,
    @Param('fecha2') fecha2:string
  ): Promise<number> {
    return this.appService.cantidadAgendamientosEntreFechas(fecha1, fecha2)
  }
  
  @Get('/funcionarioFull')
  async funcionariosFull() : Promise<object> {
    return this.appService.funcionariosFull()
  }

  // Ultimas APIs
  @Get('/pacientesNoAtendidos/:fecha')
  async pacientesNoAtendidos(
    @Param('fecha') fecha: string
  ) : Promise<object> {
    return this.appService.pacientesNoAtendidos(fecha)
  }

  @Get('pacientesAtendidos/:fecha')
  async pacientesAtendidos(
    @Param('fecha') fecha: string,
  ) : Promise<object> {
    return this.appService.pacientesAtendidos(fecha)
  }

  @Get('diferenciaOcupanciaEntreMeses/:mes1/:mes2')
  async diferenciaOcupanciaMeses(
    @Param('mes1') mes1:string,
    @Param('mes2') mes2:string
  ) : Promise<number> {
    return this.appService.diferenciaOcupanciaMeses(mes1, mes2)
  }
}
