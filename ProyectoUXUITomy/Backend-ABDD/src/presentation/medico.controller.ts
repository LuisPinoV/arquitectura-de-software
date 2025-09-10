import { Controller, Post, Body, Headers, Get, Param, Put } from '@nestjs/common';
import { CreateMedicoDto } from './medico/dto/medico-create.dto';
import { UpdateMedicoDto } from './medico/dto/medico-update.dto';
import { DeleteMedicoDto } from './medico/dto/medico-delete.dto';
import { MedicoService } from 'src/application/services/medico.service';

@Controller('medicos')
export class MedicoController
{
    constructor(private readonly service:MedicoService) {}

    @Post('create')
    create(@Body() createPacienteDto : CreateMedicoDto, @Headers('db') dbKey:string)
    {
        return this.service.CreateMedico(createPacienteDto, dbKey);
    }

    @Post('delete-all')
    deleteAll(@Headers('db') dbKey:string)
    {
        return this.service.DeleteAllMedicos(dbKey);
    }

    @Get('search-all/:db')
    async findAll(@Param('db') dbKey:string):Promise<string>
    {
        return this.service.FindAllMedicos(dbKey);
    }

    @Get('search/:id/:db')
    async findByIdDB(@Param('id') id:string,@Param('db') dbKey:string):Promise<string>
    {
        return this.service.FindMedico(dbKey, id);
    }

    @Put('update')
    async UpdatePaciente(@Body() updatePacienteDto : UpdateMedicoDto, @Headers('db') dbKey:string)
    {
        return this.service.UpdateMedico(dbKey, updatePacienteDto);
    }

    @Post('delete')
    deletePaciente(@Body() deletePacienteDto : DeleteMedicoDto, @Headers('db') dbKey:string)
    {
        return this.service.DeleteMedico(dbKey, deletePacienteDto);
    }
}