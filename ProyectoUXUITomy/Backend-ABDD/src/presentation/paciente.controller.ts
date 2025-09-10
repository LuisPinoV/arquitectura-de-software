import { Controller, Post, Body, Headers, Get, Param, Put } from '@nestjs/common';
import { PacienteService } from 'src/application/services/paciente.service';
import { CreatePacienteDto } from 'src/presentation/paciente/dto/create-paciente.dto';
import { UpdatePacienteDto } from 'src/presentation/paciente/dto/update-paciente.dto';
import { DeletePacienteDto } from './paciente/dto/delete-paciente.dto';

@Controller('pacientes')
export class PacienteController
{
    constructor(private readonly service:PacienteService) {}

    @Post('create')
    create(@Body() createPacienteDto : CreatePacienteDto, @Headers('db') dbKey:string)
    {
        return this.service.CreatePaciente(createPacienteDto, dbKey);
    }

    @Post('delete-all')
    deleteAll(@Headers('db') dbKey:string)
    {
        return this.service.DeleteAllPacientes(dbKey);
    }

    @Get('search-all/:db')
    async findAll(@Param('db') dbKey:string):Promise<string>
    {
        return this.service.FindAllPacientes(dbKey);
    }

    @Get('search/:id/:db')
    async findByIdDB(@Param('id') id:string,@Param('db') dbKey:string):Promise<string>
    {
        return this.service.FindPaciente(dbKey, id);
    }

    @Put('update')
    async UpdatePaciente(@Body() updatePacienteDto : UpdatePacienteDto, @Headers('db') dbKey:string)
    {
        return this.service.UpdatePaciente(dbKey, updatePacienteDto);
    }

    @Post('delete')
    deletePaciente(@Body() deletePacienteDto : DeletePacienteDto, @Headers('db') dbKey:string)
    {
        return this.service.DeletePaciente(dbKey, deletePacienteDto);
    }
}