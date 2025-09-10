import { Controller, Post, Body, Headers, Get, Param, Put } from '@nestjs/common';
import { FichaMedicaService } from 'src/application/services/ficha-medica.service';
import { CreateFichaMedicaDto } from './ficha-medica/dto/create-ficha-medica.dto';
import { DeleteFichaMedicaDto } from './ficha-medica/dto/delete-ficha-medica.dto';
import { UpdateFichaMedicaDto } from './ficha-medica/dto/update-ficha-medica.dto';

@Controller('fichas-medicas')
export class FichaMedicaController
{
    constructor(private readonly service:FichaMedicaService) {}

    @Post('create')
    create(@Body() createFichaMedicaDto : CreateFichaMedicaDto, @Headers('db') dbKey:string)
    {
        return this.service.CreateFichaMedica(createFichaMedicaDto, dbKey);
    }

    @Post('delete-all')
    deleteAll(@Headers('db') dbKey:string)
    {
        return this.service.DeleteAllFichasMedicas(dbKey);
    }

    @Get('search-all/:db')
    async findAll(@Param('db') dbKey:string):Promise<string>
    {
        return this.service.FindAllFichasMedicas(dbKey);
    }

    @Post('delete')
    deleteFicha(@Body() deleteFichaDto : DeleteFichaMedicaDto, @Headers('db') dbKey:string)
    {
        return this.service.DeleteFichaMedica(dbKey, deleteFichaDto);
    }

    @Get('search/:id/:db')
    async findByIdDB(@Param('id') id:string,@Param('db') dbKey:string):Promise<string>
    {
        return this.service.FindFichaMedica(dbKey, id);
    }

    @Put('update')
    async UpdateFichaMedica(@Body() updateFichaDto : UpdateFichaMedicaDto, @Headers('db') dbKey:string)
    {
        return this.service.UpdateFichaMedica(dbKey, updateFichaDto);
    }
}