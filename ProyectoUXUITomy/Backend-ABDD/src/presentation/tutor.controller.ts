import { Controller, Post, Body, Headers, Get, Param, Put } from '@nestjs/common';
import { TutorService } from 'src/application/services/tutor.service';
import { CreateTutorDto } from './tutor/dto/create-tutor.dto';
import { UpdateTutorDto } from './tutor/dto/update-tutor.dto';
import { DeleteTutorDto } from './tutor/dto/delete-tutor.dto';

@Controller('tutores')
export class TutorController
{
    constructor(private readonly service:TutorService) {}

    @Post('create')
    create(@Body() createTutorDto : CreateTutorDto, @Headers('db') dbKey:string)
    {
        return this.service.CreateTutor(createTutorDto, dbKey);
    }

    @Post('delete')
    deleteTutor(@Body() deleteTutorDto : DeleteTutorDto, @Headers('db') dbKey:string)
    {
        return this.service.DeleteTutor(dbKey, deleteTutorDto);
    }
    
    @Post('delete-all')
    deleteAll(@Headers('db') dbKey:string)
    {
        return this.service.DeleteAllTutores(dbKey);
    }

    @Get('search/:id/:db')
    async findByIdDB(@Param('id') id:string,@Param('db') dbKey:string):Promise<string>
    {
        return this.service.FindTutor(dbKey, id);
    }

    @Get('search-all/:db')
    async findAll(@Param('db') dbKey:string):Promise<string>
    {
        return this.service.FindAllTutores(dbKey);
    }
    
    @Put('update')
    async UpdateTutor(@Body() updateTutorDto : UpdateTutorDto, @Headers('db') dbKey:string)
    {
        return this.service.UpdateTutor(dbKey, updateTutorDto);
    }

}